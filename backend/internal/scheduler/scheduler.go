package scheduler

import (
	"iserveuAssignment/internal/database"
	"iserveuAssignment/internal/email"
	"log"
	"time"

	"github.com/go-co-op/gocron"
)

type Scheduler struct {
	emailService *email.EmailService
}

func NewScheduler() *Scheduler {
	return &Scheduler{
		emailService: email.NewEmailService(),
	}
}

func (s *Scheduler) Start() error {
	scheduler := gocron.NewScheduler(time.Local)

	_, err := scheduler.Every(1).Day().At("16:44").Do(s.sendDailyReport)
	if err != nil {
		return err
	}

	scheduler.StartAsync()
	log.Println("Email scheduler started - will send reports daily at 23:00")
	return nil
}

func (s *Scheduler) sendDailyReport() {
	students, err := database.GetAllStudents()
	if err != nil {
		log.Printf("Error fetching students: %v", err)
		return
	}

	err = s.emailService.SendDailyReport(students)
	if err != nil {
		log.Printf("Error sending email: %v", err)
		return
	}

	log.Println("Daily report sent successfully")
}
