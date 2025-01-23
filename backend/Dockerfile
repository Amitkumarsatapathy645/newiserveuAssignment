FROM golang:1.21-alpine

WORKDIR /app

# Install necessary packages
RUN apk add --no-cache gcc musl-dev

# Copy only go.mod and go.sum first
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire application
COPY . .

# Build the application
RUN go build -o main ./cmd/api

# Create a .env file from the environment variables
RUN echo "DB_HOST=${DB_HOST}" > .env && \
    echo "DB_PORT=${DB_PORT}" >> .env && \
    echo "DB_USER=${DB_USER}" >> .env && \
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env && \
    echo "DB_NAME=${DB_NAME}" >> .env && \
    echo "SMTP_HOST=${SMTP_HOST}" >> .env && \
    echo "SMTP_PORT=${SMTP_PORT}" >> .env && \
    echo "SMTP_EMAIL=${SMTP_EMAIL}" >> .env && \
    echo "SMTP_PASSWORD=${SMTP_PASSWORD}" >> .env && \
    echo "RECIPIENT_EMAIL=${RECIPIENT_EMAIL}" >> .env && \
    echo "SERVER_PORT=3000" >> .env

EXPOSE 3000

CMD ["./main"]