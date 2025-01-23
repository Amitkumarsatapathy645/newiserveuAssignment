package server

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Server struct {
	router *mux.Router
}

func NewServer() *Server {
	return &Server{
		router: mux.NewRouter(),
	}
}

func (s *Server) Initialize() {
	s.setupRoutes()
}

func (s *Server) setupRoutes() {
	s.router.HandleFunc("/api/upload", s.handleFileUpload).Methods("POST")
	s.router.HandleFunc("/api/students", s.getStudents).Methods("GET")
	s.router.HandleFunc("/api/download/highscorers", s.handleDownloadHighScorers).Methods("GET")
}
func (s *Server) Run() {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "3000"
	}

	// Create a new CORS handler
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Wraped router with the CORS handler
	handler := corsHandler.Handler(s.router)

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
