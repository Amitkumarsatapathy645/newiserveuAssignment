# Student Data Management System

A comprehensive Go-based system for managing student data with Excel file processing, API endpoints, and automated email reporting capabilities.

## Features

- **Excel File Processing**: API endpoint to read and store student data (ID, Name, Address, Mark) from Excel files
- **PostgreSQL Integration**: Secure storage of student data using PostgreSQL (Docker containerized)
- **High-Score Report**: API endpoint to download data of students scoring above 60%
- **Automated Email Reports**: Daily email reports sent at 11:00 PM containing complete student data
- **Database Management**: Adminer interface for easy database administration

## Prerequisites

- Docker and Docker Compose
- Go 1.19 or higher
- Gmail account (for email functionality)
- Git

## Project Structure

```
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go
│   ├── internal/
│   │   ├── database/
│   │   │   └── database.go
│   │   ├── server/
│   │   │   ├── routes.go
│   │   │   └── server.go
│   │   ├── scheduler/
│   │   │   └── scheduler.go
│   │   └── email/
│   │       └── service.go
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── .env
└── frontend/
    └── ...
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Amitkumarsatapathy645/iserveuAssignment.git
   cd <project-directory>
   ```

2. **Environment Configuration**
   
   Create a `.env` file in the project root:
   ```env
   # Database Configuration
   DB_HOST=db
   DB_PORT=5432
   DB_USER=database user
   DB_PASSWORD=your password
   DB_NAME=your database name

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your-email@gmail.com
   SMTP_PASSWORD=your-app-specific-password
   RECIPIENT_EMAIL=recipient@example.com
   ```

3. **Build and Run**
   ```bash
   docker-compose up --build
   ```

## API Endpoints

1. **Upload Excel File**
   - Method: POST
   - Endpoint: `/api/upload`
   - Content-Type: multipart/form-data
   - Form field name: `file`
2. **Download High-Score Report**
   - Method: GET
   - Endpoint: `/api/download/highscore`

## Email Reports

The system automatically sends daily email reports at 11:00 PM containing:
- Complete student list
- Student IDs
- Names
- Addresses
- Marks

## Troubleshooting

1. **Database Connection Issues**
   - Verify PostgreSQL container is running: `docker ps`
   - Check logs: `docker logs student_db`
   - Ensure correct database credentials in `.env`

2. **Email Sending Issues**
   - Verify Gmail App Password is correct
   - Check if 2FA is enabled on Gmail account
   - Review application logs: `docker logs student_app`

3. **Excel Upload Issues**
   - Ensure Excel file follows required format
   - Check file permissions
   - Verify file is not corrupted

## Development

To add new features or modify existing ones:

1. **Local Development**
   ```bash
   go mod tidy
   go run cmd/api/main.go
   ```

## Security Notes

- Database credentials should be changed in production
- Use strong passwords for all services
- Keep the `.env` file secure and never commit it to version control
- Regular security updates are recommended

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

[ By-Amit Kumar satapathy ]