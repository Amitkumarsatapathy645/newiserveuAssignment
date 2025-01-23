package main

import (
	"iserveuAssignment/internal/database"
	"iserveuAssignment/internal/scheduler"
	"iserveuAssignment/internal/server"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	// for Loading environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
	// Initialized database connection
	if err := database.InitDB(); err != nil {
		log.Fatal(err)
	}
	// Initialized and stardt the email scheduler
	emailScheduler := scheduler.NewScheduler()
	if err := emailScheduler.Start(); err != nil {
		log.Printf("Warning: Failed to start scheduler: %v", err)
	} else {
		log.Println("Email scheduler started successfully")
	}
	// Created and initialized server
	srv := server.NewServer()
	srv.Initialize()
	srv.Run()
}
