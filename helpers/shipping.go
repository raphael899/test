package helpers

import (
	"fmt"
	"math/rand"
	"regexp"
	"time"
)

const (
	letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	guideLength = 10
)

const (
	vehiclePlateRegex = `^[A-Z]{3}\d{3}$`
)

func GenerateUniqueGuideNumber() string {
	rand.Seed(time.Now().UnixNano())

	guideNumber := make([]byte, guideLength)
	for i := 0; i < guideLength; i++ {
		guideNumber[i] = letterBytes[rand.Intn(len(letterBytes))]
	}

	return string(guideNumber)
}

func ValidateVehiclePlate(plate string) bool {
	match, _ := regexp.MatchString(vehiclePlateRegex, plate)
	return match
}

func ValidateFleetNumber(fleetNumber string) bool {
	fmt.Println(fleetNumber)
	regex := "^[A-Za-z]{3}\\d{4}[A-Za-z]$"
	match, err := regexp.MatchString(regex, fleetNumber)
	if err != nil {
		// Ocurrió un error al evaluar la expresión regular
		return false
	}
	return match
}
