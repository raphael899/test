package models

import(
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)


type GroundShipping struct {
	Id           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	ProductType   string             `json:"productType,omitempty" bson:"productType,omitempty"`
	Quantity      int                `json:"quantity,omitempty" bson:"quantity,omitempty"`
	RegistrationDate time.Time       `json:"registrationDate,omitempty" bson:"registrationDate,omitempty"`
	DeliveryDate  time.Time          `json:"deliveryDate,omitempty" bson:"deliveryDate,omitempty"`
	Warehouse     string             `json:"warehouse,omitempty" bson:"warehouse,omitempty"`
	ShippingPrice float64            `json:"shippingPrice,omitempty" bson:"shippingPrice,omitempty"`
	VehiclePlate  string             `json:"vehiclePlate,omitempty" bson:"vehiclePlate,omitempty"`
	GuideNumber   string             `json:"guideNumber,omitempty" bson:"guideNumber,omitempty"`
	ClientId      primitive.ObjectID `json:"clientID,omitempty" bson:"clientID,omitempty"`
}
