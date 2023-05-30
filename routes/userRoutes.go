package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/test/controllers"
)

// SetupUserRoutes configura las rutas relacionadas con los usuarios
func SetupUserRoutes(app *fiber.App, userController *controllers.UserController) {
	app.Post("/users/register", userController.AddUser)
	app.Post("/users/login", userController.Login)
}
