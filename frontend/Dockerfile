# Stage 1: Build
FROM node:21-alpine as builder

WORKDIR /app

# Copy package files
COPY frontend/package.json ./
COPY frontend/pnpm-lock.yaml* ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source files (excluding node_modules)
COPY frontend/src ./src
COPY frontend/tsconfig*.json ./
COPY frontend/vite.config.ts ./
COPY frontend/index.html ./

# Build the React application with Vite
RUN pnpm build

# Stage 2: Serve
FROM nginx:alpine

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
