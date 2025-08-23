FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR file
COPY target/*.jar app.jar

# Create directory for file uploads
RUN mkdir -p /app/uploads/cars

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]