#!/bin/bash

# Build the application
./mvnw clean package -DskipTests

# Build Docker image
docker build -t cars-app:latest .

# Run with Docker Compose
docker-compose up -d
