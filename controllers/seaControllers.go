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

type MaritimeShippingController struct {
	coll *mongo.Collection
}

func NewMaritimeShippingController(db *mongo.Database) *MaritimeShippingController {
	coll := db.Collection("maritimeShipping")

	return &MaritimeShippingController{
		coll: coll,
	}
}

func (mc *MaritimeShippingController) CreateMaritimeShipping(c *fiber.Ctx) error {
	token := c.Locals("token").(*jwt.Token)

	if token != nil && token.Valid {
		claims := token.Claims.(jwt.MapClaims)
		userIDClaim, ok := claims["Id"].(string)
		fmt.Println("userIDClaim", userIDClaim)
		if !ok {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		clientID, err := primitive.ObjectIDFromHex(userIDClaim)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		var maritimeShipping models.MaritimeShipping
		if err := c.BodyParser(&maritimeShipping); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		if !helpers.ValidateFleetNumber(maritimeShipping.FleetNumber) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid fleet number format"})
		}

		maritimeShipping.GuideNumber = helpers.GenerateUniqueGuideNumber()
		maritimeShipping.ClientID = clientID
		maritimeShipping.RegistrationDate = time.Now()

		if maritimeShipping.Quantity > 10 {
			maritimeShipping.ShippingPrice *= 0.95 // 5% discount
		}

		_, err = mc.coll.InsertOne(context.TODO(), maritimeShipping)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusCreated).JSON(maritimeShipping)
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
}

func (mc *MaritimeShippingController) GetMaritimeShippingByClientID(c *fiber.Ctx) error {
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
		fleetNumber := c.Query("fleetNumber")
		registrationDate := c.Query("registrationDate")
		quantity := c.Query("quantity")
		shippingPrice := c.Query("shippingPrice")

		// Add other filter parameters as needed

		// Define the base filter with clientID
		filter := bson.M{"clientID": clientObjectID}

		// Add additional filter conditions based on query parameters
		if guideNumber != "" {
			filter["guideNumber"] = guideNumber
		}

		if fleetNumber != "" {
			filter["fleetNumber"] = fleetNumber
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

		// Add other filter conditions as needed

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

		// Retrieve maritime shippings from the database based on the filter and pagination parameters
		cursor, err := mc.coll.Find(context.TODO(), filter, options.Find().SetSkip(int64(skip)).SetLimit(int64(pageSizeNum)))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		defer cursor.Close(context.TODO())

		// Iterate through the cursor and collect the maritime shippings
		var maritimeShippings []models.MaritimeShipping
		for cursor.Next(context.TODO()) {
			var maritimeShipping models.MaritimeShipping
			if err := cursor.Decode(&maritimeShipping); err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
			maritimeShippings = append(maritimeShippings, maritimeShipping)
		}

		// Check if any maritime shippings were found
		if len(maritimeShippings) == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No maritime shippings found for the specified client ID"})
		}

		return c.Status(fiber.StatusOK).JSON(maritimeShippings)
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
}

func (mc *MaritimeShippingController) UpdateMaritimeShipping(c *fiber.Ctx) error {
	token := c.Locals("token").(*jwt.Token)

	if token != nil && token.Valid {
		claims := token.Claims.(jwt.MapClaims)
		userIDClaim, ok := claims["Id"].(string)
		fmt.Println("userIDClaim", userIDClaim)
		if !ok {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		clientID, err := primitive.ObjectIDFromHex(userIDClaim)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		shippingID := c.Params("shippingId")

		shippingObjectID, err := primitive.ObjectIDFromHex(shippingID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shipping ID"})
		}

		fmt.Println(shippingObjectID, "idddddd")

		var updatedShipping models.MaritimeShipping
		if err := c.BodyParser(&updatedShipping); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		if !helpers.ValidateFleetNumber(updatedShipping.FleetNumber) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid fleet number format"})
		}

		// Get the existing shipping record from the database
		filter := bson.M{"_id": shippingObjectID, "clientID": clientID}
		var existingShipping models.MaritimeShipping
		err = mc.coll.FindOne(context.TODO(), filter).Decode(&existingShipping)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Maritime shipping not found"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Update the fields of the existing shipping record
		existingShipping.ProductType = updatedShipping.ProductType
		existingShipping.Quantity = updatedShipping.Quantity
		existingShipping.DeliveryDate = updatedShipping.DeliveryDate
		existingShipping.Port = updatedShipping.Port
		existingShipping.ShippingPrice = updatedShipping.ShippingPrice
		existingShipping.FleetNumber = updatedShipping.FleetNumber

		// Save the updated shipping record to the database
		_, err = mc.coll.ReplaceOne(context.TODO(), filter, existingShipping)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusOK).JSON(existingShipping)
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
}

func (mc *MaritimeShippingController) DeleteMaritimeShipping(c *fiber.Ctx) error {
	token := c.Locals("token").(*jwt.Token)

	if token != nil && token.Valid {
		shippingID := c.Params("shippingId")

		shippingObjectID, err := primitive.ObjectIDFromHex(shippingID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid shipping ID"})
		}

		// Delete the shipping record from the database
		filter := bson.M{"_id": shippingObjectID}
		result, err := mc.coll.DeleteOne(context.TODO(), filter)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		if result.DeletedCount == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Maritime shipping not found"})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Maritime shipping deleted"})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
}
