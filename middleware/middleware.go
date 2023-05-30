package middleware

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"strings" 
)

func IsAuthenticated() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Obtener el token de la cabecera de la solicitud
		authHeader := c.Get("Authorization")

		// Verificar si se proporcionó un token
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"message": "Missing token",
			})
		}

		// Verificar si el token es de tipo "bearer"
		if len(strings.Split(authHeader, " ")) != 2 || strings.Split(authHeader, " ")[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"message": "Invalid token type. Use Bearer token.",
			})
		}

		// Obtener el token
		tokenString := strings.Split(authHeader, " ")[1]

		// Validar y decodificar el token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Verificar el método de firma del token
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Invalid token")
			}
			// Establecer la clave secreta utilizada para firmar el token
			signingKey := []byte("secret-key")
			return signingKey, nil
		})

		// Verificar si hubo un error al validar el token
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"message": "Invalid token",
			})
		}

		// Establecer el token en el contexto
		c.Locals("token", token)

		// El token es válido, se puede continuar con la siguiente ruta
		return c.Next()
	}
}
