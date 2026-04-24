# Stage 1: Build the Frontend & Backend
FROM maven:3.9-eclipse-temurin-17-alpine as builder

# Install Node.js for the frontend build
RUN apk add --no-cache nodejs npm

WORKDIR /app

# 1. Prepare Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# 2. Prepare Backend
COPY pom.xml ./
RUN mvn dependency:go-offline

# 3. Build Everything
COPY . .
RUN cd frontend && npm run build
RUN mvn clean package -DskipTests

# Stage 2: Run the Application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
