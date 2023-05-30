package config

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// NewDB crea y devuelve una conexión a la base de datos
func NewDB() (*mongo.Database, error) {
	uri := "mongodb+srv://rph89:nhY9HioG9YNDUKii@cluster0.e1mocmn.mongodb.net/?retryWrites=true&w=majority"
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}

	db := client.Database("gomongodb")
	return db, nil
}
