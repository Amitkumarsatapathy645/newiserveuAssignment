package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// here InitDB initializes the database connection
func InitDB() error {
	connectionString := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	var err error
	DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		return fmt.Errorf("error opening database: %v", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("error connecting to database: %v", err)
	}

	// Created the students table if it doesn't exist
	createTableSQL := `
    CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(100) NOT NULL,
        address TEXT,
        mark FLOAT
    )`

	_, err = DB.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("error creating table: %v", err)
	}

	log.Println("Database connection established successfully")
	return nil
}

// retrieves a list of students with marks above 60
func GetHighScoringStudents() (*sql.Rows, error) {
	query := `
        SELECT id, student_name, address, mark 
        FROM students 
        WHERE mark > 60 
        ORDER BY mark DESC
    `
	return DB.Query(query)
}
