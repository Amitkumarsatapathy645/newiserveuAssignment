package email

import (
	"fmt"
	"iserveuAssignment/internal/database"
	"net/smtp"
	"os"
)

type EmailService struct {
	host     string
	port     string
	from     string
	password string
	to       string
}

func NewEmailService() *EmailService {
	return &EmailService{
		host:     os.Getenv("SMTP_HOST"),
		port:     os.Getenv("SMTP_PORT"),
		from:     os.Getenv("SMTP_EMAIL"),
		password: os.Getenv("SMTP_PASSWORD"),
		to:       os.Getenv("RECIPIENT_EMAIL"),
	}
}

func (s *EmailService) SendDailyReport(students []database.Student) error {
	auth := smtp.PlainAuth("", s.from, s.password, s.host)

	subject := "Subject: Daily Student Report\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"

	body := "<html><body>"
	body += "<h2 style='text-align: center;'>Daily Student Report</h2>"
	body += "<table border='1' style='border-collapse: collapse; width: 100%;'>"
	body += "<tr style='background-color: #4CAF50; color: white;'><th>ID</th><th>Name</th><th>Address</th><th>Mark</th></tr>"

	for i, student := range students {
		rowColor := "#f2f2f2"
		if i%2 == 0 {
			rowColor = "#ffffff"
		}
		body += fmt.Sprintf("<tr style='background-color: %s;'><td style='padding: 8px;'>%d</td><td style='padding: 8px;'>%s</td><td style='padding: 8px;'>%s</td><td style='padding: 8px;'>%.2f</td></tr>",
			rowColor, student.ID, student.StudentName, student.Address, student.Mark)
	}

	body += "</table></body></html>"

	msg := []byte(subject + mime + body)
	addr := fmt.Sprintf("%s:%s", s.host, s.port)

	return smtp.SendMail(addr, auth, s.from, []string{s.to}, msg)
}
