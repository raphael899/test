package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/test/controllers"
	"github.com/test/middleware"
)

func SetupMaritimeShippingRoutes(router fiber.Router, maritimeController *controllers.MaritimeShippingController) {
	router.Post("/maritime-shipping", middleware.IsAuthenticated(), maritimeController.CreateMaritimeShipping)
	router.Get("/maritime-shipping/:clientId", middleware.IsAuthenticated(), maritimeController.GetMaritimeShippingByClientID)
	router.Put("/maritime-shipping/:shippingId", middleware.IsAuthenticated(), maritimeController.UpdateMaritimeShipping)
	router.Delete("/maritime-shipping/:shippingId", middleware.IsAuthenticated(), maritimeController.DeleteMaritimeShipping)

}
