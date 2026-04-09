# Stage 1: Build the application
FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /app

# Copy the maven wrapper and the pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Make the maven wrapper executable
# Download dependencies offline to cache them in a separate image layer.
RUN chmod +x ./mvnw && \
    ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Package the application (skipping tests for a cleaner/faster container build)
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the minimal final image
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

# Create a non-root user and group for security best-practices
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built executable jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
