package models

import(
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)


type MaritimeShipping struct {
	ID            primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	ProductType   string             `json:"productType,omitempty" bson:"productType,omitempty"`
	Quantity      int                `json:"quantity,omitempty" bson:"quantity,omitempty"`
	RegistrationDate time.Time       `json:"registrationDate,omitempty" bson:"registrationDate,omitempty"`
	DeliveryDate  time.Time          `json:"deliveryDate,omitempty" bson:"deliveryDate,omitempty"`
	Port          string             `json:"port,omitempty" bson:"port,omitempty"`
	ShippingPrice float64            `json:"shippingPrice,omitempty" bson:"shippingPrice,omitempty"`
	FleetNumber   string             `json:"fleetNumber,omitempty" bson:"fleetNumber,omitempty"`
	GuideNumber   string             `json:"guideNumber,omitempty" bson:"guideNumber,omitempty"`
	ClientID      primitive.ObjectID `json:"clientID,omitempty" bson:"clientID,omitempty"`
}
