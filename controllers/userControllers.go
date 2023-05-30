package controllers

import (
	"context"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/test/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// UserController es el controlador para las operaciones relacionadas con los usuarios
type UserController struct {
	coll *mongo.Collection
}

// NewUserController crea una instancia del controlador de usuarios
func NewUserController(db *mongo.Database) *UserController {
	coll := db.Collection("users")

	return &UserController{
		coll: coll,
	}
}

func (uc *UserController) AddUser(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if user.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Please provide a user name"})
	}

	if user.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Please provide a user email"})
	}

	if user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Please provide a user password"})
	}

	filter := bson.D{{Key: "email", Value: user.Email}}
	var resultQuery models.User
	err := uc.coll.FindOne(context.TODO(), filter).Decode(&resultQuery)
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email already exists"})
	} else if err != mongo.ErrNoDocuments {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	result, err := uc.coll.InsertOne(
		context.TODO(),
		bson.D{
			bson.E{Key: "name", Value: user.Name},
			bson.E{Key: "email", Value: user.Email},
			bson.E{Key: "password", Value: string(hashedPassword)},
		},
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = user.Email
	claims["Id"] = result.InsertedID.(primitive.ObjectID).Hex()
	claims["name"] = user.Name
	claims["exp"] = time.Now().Add(3 * 24 * time.Hour).Unix()

	signingKey := []byte("secret-key")
	signedToken, err := token.SignedString(signingKey)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"data":  result,
		"token": signedToken,
	})
}

func (uc *UserController) Login(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if user.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Please provide a user email"})
	}

	if user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Please provide a user password"})
	}

	filter := bson.D{{Key: "email", Value: user.Email}}
	var resultQuery models.User
	err := uc.coll.FindOne(context.TODO(), filter).Decode(&resultQuery)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(resultQuery.Password), []byte(user.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["Id"] = resultQuery.Id
	claims["email"] = resultQuery.Email
	claims["name"] = resultQuery.Name
	claims["exp"] = time.Now().Add(3 * 24 * time.Hour).Unix()

	signingKey := []byte("secret-key")
	signedToken, err := token.SignedString(signingKey)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"data":  resultQuery,
		"token": signedToken,
	})
}
