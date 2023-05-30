package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/test/config"
	"github.com/test/controllers"
	"github.com/test/routes"
)

func main() {
	app := fiber.New()

	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	db, err := config.NewDB()
	if err != nil {
		panic(err)
	}

	userController := controllers.NewUserController(db)
	groundController := controllers.NewGroundShippingController(db)
	maritimeController := controllers.NewMaritimeShippingController(db)

	app.Use(cors.New())
	app.Static("/", "./client/dist")

	//users
	routes.SetupUserRoutes(app, userController)
	//ground shipping
	routes.SetupGroundShippingRoutes(app, groundController)
	//maritime shipping
	routes.SetupMaritimeShippingRoutes(app, maritimeController)

	app.Listen(":" + port)
}
