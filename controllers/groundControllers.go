package controllers

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/test/helpers"
	"github.com/test/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type GroundShippingController struct {
	coll *mongo.Collection
}

func NewGroundShippingController(db *mongo.Database) *GroundShippingController {
	coll := db.Collection("groundShipping")

	return &GroundShippingController{
		coll: coll,
	}
}

func (gc *GroundShippingController) CreateGroundShipping(c *fiber.Ctx) error {
	token := c.Locals("token").(*jwt.Token)

	if token != nil && token.Valid {

		fmt.Println(token)
		claims := token.Claims.(jwt.MapClaims)
		userIDClaim, ok := claims["Id"].(string)
		if !ok {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		clientID, err := primitive.ObjectIDFromHex(userIDClaim)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		var groundShipping models.GroundShipping
		if err := c.BodyParser(&groundShipping); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		if !helpers.ValidateVehiclePlate(groundShipping.VehiclePlate) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid vehicle plate format"})
		}

		groundShipping.GuideNumber = helpers.GenerateUniqueGuideNumber()
		groundShipping.ClientId = clientID

		if groundShipping.Quantity > 10 {
			groundShipping.ShippingPrice *= 0.95 // 5% discount
		}

		// Generar la fecha de registro automáticamente
		groundShipping.RegistrationDate = time.Now()

		// Verifica y valida los campos adicionales
		if groundShipping.ProductType == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Product type is required"})
		}

		if groundShipping.DeliveryDate.IsZero() {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Delivery date is required"})
		}

		if groundShipping.Warehouse == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Warehouse is required"})
		}

		_, err = gc.coll.InsertOne(context.TODO(), groundShipping)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusCreated).JSON(groundShipping)
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
}

func (gc *GroundShippingController) GetGroundShippingByClientID(c *fiber.Ctx) error {
	clientID := c.Params("clientId")
	token := c.Locals("token").(*jwt.Token)

	if token != nil && token.Valid {
		// Convert clientID to primitive.ObjectID
		clientObjectID, err := primitive.ObjectIDFromHex(clientID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid client ID"})
		}

		// Get filter parameters from query
		guideNumber := c.Query("guideNumber")
		validateVehiclePlate := c.Query("validateVehiclePlate")
		registrationDate := c.Query("registrationDate")
		quantity := c.Query("quantity")
		shippingPrice := c.Query("shippingPrice")

		// Define the base filter with clientID
		filter := bson.M{"clientID": clientObjectID}

		// Add additional filter conditions based on query parameters
		if guideNumber != "" {
			filter["guideNumber"] = guideNumber
		}

		if validateVehiclePlate != "" {
			filter["fleetNumber"] = validateVehiclePlate
		}

		if registrationDate != "" {
			filter["registrationDate"] = registrationDate
		}

		if quantity != "" {
			filter["quantity"] = quantity
		}

		if shippingPrice != "" {
			filter["shippingPrice"] = shippingPrice
		}

		// Apply pagination parameters
		page := c.Query("page")
		pageSize := c.Query("pageSize")

		// Set default values if pagination parameters are not provided
		if page == "" {
			page = "1"
		}
		if pageSize == "" {
			pageSize = "10"
		}

		// Convert pagination parameters to integers
		pageNum, err := strconv.Atoi(page)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid page number"})
		}
		pageSizeNum, err := strconv.Atoi(pageSize)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid page size"})
		}

		// Calculate skip value based on pagination parameters
		skip := (pageNum - 1) * pageSizeNum

		// Retrieve ground shippings from the database based on the filter and pagination parameters
		cursor, err := gc.coll.Find(context.TODO(), filter, options.Find().SetSkip(int64(skip)).SetLimit(int64(pageSizeNum)))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		defer cursor.Close(context.TODO())

		// Iterate through the cursor and collect the ground shippings
		var groundShippings []models.GroundShipping
		for cursor.Next(context.TODO()) {
			var groundShipping models.GroundShipping
			if err := cursor.Decode(&groundShipping); err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
			groundShippings = append(groundShippings, groundShipping)
		}

		// Check if any ground shippings were found
		if len(groundShippings) == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No ground shippings found for the specified client ID"})
		}

		return c.Status(fiber.StatusOK).JSON(groundShippings)
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
}

func (gc *GroundShippingController) UpdateGroundShipping(c *fiber.Ctx) error {
	token := c.Locals("token").(*jwt.Token)

	if token != nil && token.Valid {
		// Obtener el ID del usuario desde el token
		claims := token.Claims.(jwt.MapClaims)
		userIDClaim, ok := claims["Id"].(string)
		if !ok {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		// Convertir el ID del usuario a ObjectID
		clientID, err := primitive.ObjectIDFromHex(userIDClaim)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		// Obtener el ID del envío terrestre a editar desde los parámetros de la solicitud
		shippingID := c.Params("shippingId")

		// Convertir el ID del envío terrestre a ObjectID
		shippingObjectID, err := primitive.ObjectIDFromHex(shippingID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shipping ID"})
		}

		var updatedShipping models.GroundShipping
		if err := c.BodyParser(&updatedShipping); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		// Verificar si el envío terrestre pertenece al cliente que realiza la solicitud
		filter := bson.M{
			"_id":      shippingObjectID,
			"clientID": clientID,
		}

		// Obtener el envío terrestre existente desde la base de datos
		existingShipping := models.GroundShipping{}
		err = gc.coll.FindOne(context.TODO(), filter).Decode(&existingShipping)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Ground shipping not found"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Actualizar los campos del envío terrestre
		existingShipping.ProductType = updatedShipping.ProductType
		existingShipping.Quantity = updatedShipping.Quantity
		existingShipping.DeliveryDate = updatedShipping.DeliveryDate
		existingShipping.Warehouse = updatedShipping.Warehouse

		// Validar los campos adicionales
		if existingShipping.ProductType == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Product type is required"})
		}

		if existingShipping.DeliveryDate.IsZero() {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Delivery date is required"})
		}

		if existingShipping.Warehouse == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Warehouse is required"})
		}

		// Actualizar el envío terrestre en la base de datos
		update := bson.M{
			"$set": existingShipping,
		}
		_, err = gc.coll.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusOK).JSON(existingShipping)
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
}

func (gc *GroundShippingController) DeleteGroundShipping(c *fiber.Ctx) error {
	token := c.Locals("token").(*jwt.Token)

	if token != nil && token.Valid {
		shippingID := c.Params("shippingId")

		shippingObjectID, err := primitive.ObjectIDFromHex(shippingID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shipping ID"})
		}

		// Delete the ground shipping record from the database
		filter := bson.M{"_id": shippingObjectID}
		result, err := gc.coll.DeleteOne(context.TODO(), filter)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		if result.DeletedCount == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Ground shipping not found"})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Ground shipping deleted"})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
}
