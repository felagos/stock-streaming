# Stock Streaming System - Makefile for Gradle
# Compatible con Windows (gradlew.bat) y Unix/Linux/macOS (./gradlew)

ifdef OS
	GRADLE_CMD=.\gradlew.bat
	BACKEND_GRADLE=.\backend\gradlew.bat
else
	GRADLE_CMD=./gradlew
	BACKEND_GRADLE=./backend/gradlew
endif

.PHONY: help build full-build run run-frontend run-all clean test docker-build docker-rebuild docker-up docker-down docker-logs proto-gen generate-pojo

help:
	@echo "Stock Streaming System - Available commands:"
	@echo ""
	@echo "Build Commands:"
	@echo "  make build              - Build all services with Gradle"
	@echo "  make build-frontend     - Build frontend with pnpm"
	@echo "  make full-build         - Clean build (clean + build)"
	@echo "  make proto-gen          - Generate Java sources from .proto files"
	@echo "  make generate-pojo      - Generate POJO classes from .proto files"
	@echo "  make docker-build       - Build Docker images"
	@echo "  make docker-rebuild     - Rebuild Docker images without cache"
	@echo ""
	@echo "Run Commands (Local):"
	@echo "  make run                - Start backend (gRPC + API Gateway)"
	@echo "  make run-frontend       - Start Frontend development server (port 3000) with pnpm"
	@echo "  make run-all            - Build and run all services"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-up          - Start all services with Docker Compose"
	@echo "  make docker-down        - Stop all services"
	@echo "  make docker-logs        - View Docker Compose logs"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make test               - Run all tests"
	@echo "  make clean              - Clean build artifacts"
	@echo ""

build:
	@echo "Building backend (gRPC Server + API Gateway)..."
	cd backend && $(GRADLE_CMD) build
	@echo "Build complete!"

full-build:
	@echo "Cleaning and building all services..."
	cd backend && $(GRADLE_CMD) clean build
	@echo "Full build complete!"

proto-gen:
	@echo "Generating Java sources from .proto files..."
ifdef OS
	docker run --rm -v "$(shell cd)"\\backend:/project -w /project gradle:8.6-jdk21 gradle generateProto --no-daemon
else
	docker run --rm -v "$(CURDIR)/backend:/project" -w /project gradle:8.6-jdk21 gradle generateProto --no-daemon
endif
	@echo "Proto generation complete!"
	@echo "Generated files location: backend/build/generated/source/proto/main/"

generate-pojo:
	@echo "Generating POJO classes from .proto files..."
	cd backend && $(GRADLE_CMD) generateProto
	@echo "POJO generation complete!"
	@echo "Generated files location: backend/build/generated/source/proto/main/"

run:
	@echo "Starting backend on ports 8080 (API) and 9090 (gRPC)..."
	cd backend && $(GRADLE_CMD) bootRun

build-frontend:
	@echo "Building frontend with pnpm..."
	cd frontend && npx pnpm install && npx pnpm build
	@echo "Frontend build complete!"

run-frontend:
	@echo "Starting frontend development server on http://localhost:3000"
	cd frontend && npx pnpm install && npx pnpm dev

clean:
	@echo "Cleaning build artifacts..."
	cd backend && $(GRADLE_CMD) clean
	@echo "Clean complete!"

test:
	@echo "Running tests..."
	cd backend && $(GRADLE_CMD) test
	@echo "Tests complete!"

docker-build:
	@echo "Building Docker images..."
	docker-compose build
	@echo "Docker build complete!"

docker-rebuild:
	@echo "Rebuilding Docker images without cache..."
	docker-compose build --no-cache
	@echo "Docker rebuild complete!"

docker-up:
	@echo "Starting services with Docker Compose..."
	docker-compose up -d
	@echo "Services started!"
	@echo ""
	@echo "Frontend:    http://localhost:3000"
	@echo "Backend API: http://localhost:8080"
	@echo "gRPC Server: localhost:9090"

docker-down:
	@echo "Stopping services..."
	docker-compose down
	@echo "Services stopped!"

docker-logs:
	@echo "Viewing Docker Compose logs (Ctrl+C to exit)..."
	docker-compose logs -f
