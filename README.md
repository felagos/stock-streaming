# Stock Streaming System

Real-time stock price streaming dashboard built with gRPC, Spring Boot, and React.

## 🏗️ Project Structure

```
stock-streaming/
├── backend/                  # Java Spring Boot + gRPC server
│   ├── src/
│   │   ├── main/java/       # Main source code
│   │   └── proto/           # Protocol Buffer definitions
│   ├── build.gradle         # Gradle build configuration
│   └── Dockerfile           # Docker image for backend
├── frontend/                # React TypeScript + Vite
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks (SSE, API)
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   └── Dockerfile           # Docker image for frontend
├── docker-compose.yml       # Docker Compose orchestration
├── Makefile                 # Build and run commands
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Backend**: Java 21, Gradle 8.6
- **Frontend**: Node.js 21+, pnpm
- **Docker**: Docker Engine + Docker Compose (optional)

### Local Development

#### 1. Build Backend
```bash
make build
```

#### 2. Build Frontend
```bash
make build-frontend
```

#### 3. Run Backend (Terminal 1)
```bash
make run
```

Backend will be available at:
- **REST API**: http://localhost:8080
- **gRPC Server**: localhost:9090

#### 4. Run Frontend (Terminal 2)
```bash
make run-frontend
```

Frontend will be available at: http://localhost:3000

### Docker Compose

#### Build Images
```bash
make docker-build
```

#### Start All Services
```bash
make docker-up
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **gRPC Server**: localhost:9090

#### Stop Services
```bash
make docker-down
```

#### View Logs
```bash
make docker-logs
```

## 🛠️ Available Commands

See all available commands:
```bash
make help
```

### Build Commands
- `make build` - Build backend with Gradle
- `make build-frontend` - Build frontend with pnpm
- `make full-build` - Clean build all services
- `make proto-gen` - Generate Java sources from .proto files

### Run Commands
- `make run` - Start backend (REST API + gRPC)
- `make run-frontend` - Start frontend dev server
- `make run-all` - Build and run all services

### Docker Commands
- `make docker-build` - Build Docker images
- `make docker-rebuild` - Rebuild without cache
- `make docker-up` - Start services with Docker Compose
- `make docker-down` - Stop services
- `make docker-logs` - View Docker logs

### Utility Commands
- `make test` - Run backend tests
- `make clean` - Clean build artifacts

## 📡 Architecture

### Backend
- **Spring Boot** 3.3.0 - REST API and server framework
- **gRPC** 1.59.0 - Efficient RPC for streaming
- **Protocol Buffers** - Message serialization

API Endpoints:
- `GET /api/stocks` - Get all available stocks
- `GET /api/stream/sse` - Server-Sent Events stream for real-time prices

### Frontend
- **React** 19.2.4 - UI library
- **TypeScript** 5.9.3 - Type-safe JavaScript
- **Vite** 5.4.21 - Fast build tool
- **Axios** - HTTP client
- **TanStack Query** - Data fetching and caching

Features:
- Real-time stock price updates via SSE
- Interactive stock card display
- Connection status monitoring

## 🔄 Data Flow

```
Backend gRPC Service
    ↓ (stock price streams)
Backend API Gateway (REST + SSE)
    ↓ (SSE events)
Frontend (React + Vite)
    ↓ (HTTP requests)
User Dashboard
```

## 🐳 Docker Architecture

Multi-stage builds for optimized images:

**Backend Dockerfile:**
- Stage 1: Gradle builder image
- Stage 2: Lightweight JRE image with JAR

**Frontend Dockerfile:**
- Stage 1: Node builder for npm/pnpm + Vite compilation
- Stage 2: Nginx Alpine for static content serving

## 📝 Environment Variables

Create `.env.local` in the frontend directory:

```env
VITE_API_URL=http://localhost:8080/api
```

For Docker, the API URL is automatically set to the backend service.

## 🧪 Testing

Run backend tests:
```bash
make test
```

## 📦 Dependencies

### Backend
- Spring Boot Web & WebMVC
- gRPC Server & Client
- Protocol Buffers
- Gradle with Protobuf plugin

### Frontend
- React & React DOM
- TypeScript
- Vite
- TanStack React Query
- Axios
- pnpm

## 🔧 Troubleshooting

### Port Already in Use
If ports 3000, 8080, or 9090 are already in use:
- Change port mappings in `docker-compose.yml`
- Or modify build/run configurations

### Node/npm Issues
If facing issues with node_modules:
```bash
cd frontend && rm -rf node_modules pnpm-lock.yaml && pnpm install
```

### Gradle Build Issues
Clean and rebuild:
```bash
cd backend && ./gradlew clean build
```

## 📄 License

[Add your license here]

## 👥 Contributing

[Add contribution guidelines here]
