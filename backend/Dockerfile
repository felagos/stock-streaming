# Stage 1: Build with Gradle
FROM gradle:8.6-jdk21 AS builder

WORKDIR /build

# Copy only build configuration files first to cache dependencies layer
COPY build.gradle .
COPY settings.gradle* ./

# Download dependencies in a separate layer (cached unless build.gradle changes)
RUN gradle dependencies --no-daemon || true

# Now copy source code
COPY src/ src/

# Build the application
RUN gradle build -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /build/build/libs/stock-streaming-1.0.0.jar app.jar

EXPOSE 8080 9090

ENTRYPOINT ["java", "-jar", "app.jar"]
