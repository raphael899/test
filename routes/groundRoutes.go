package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/test/controllers"
	"github.com/test/middleware"
)

func SetupGroundShippingRoutes(router fiber.Router, groundController *controllers.GroundShippingController) {
	router.Post("/ground-shipping", middleware.IsAuthenticated(), groundController.CreateGroundShipping)
	router.Get("/ground-shipping/:clientId", middleware.IsAuthenticated(), groundController.GetGroundShippingByClientID)
	router.Put("/ground-shipping/:shippingId", middleware.IsAuthenticated(), groundController.UpdateGroundShipping)
	router.Delete("/ground-shipping/:shippingId", middleware.IsAuthenticated(), groundController.DeleteGroundShipping)
}
