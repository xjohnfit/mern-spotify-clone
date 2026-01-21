# Comprehensive Dockerfile for MERN Spotify App
# --- Frontend Build Stage ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Backend Build Stage ---
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./backend/
RUN npm ci --omit=dev --prefix backend
COPY backend/ ./backend/

# Copy frontend build to backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app/backend

# Copy backend files
COPY --from=backend-build /app/backend .

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ../frontend/dist

# Set environment variables (override in Kubernetes as needed)
ENV NODE_ENV=production
ENV PORT=5002

# Expose backend port
EXPOSE 5002

# Start backend server
CMD ["node", "src/index.js"]