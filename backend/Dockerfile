# ---------------------------
# Stage 1: Build
# ---------------------------
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build && ls -l dist

# ---------------------------
# Stage 2: Production
# ---------------------------
FROM node:22-slim AS production

WORKDIR /app

# Copy only package.json & package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Copy any other needed files (e.g., env.loader.js, config, etc.)
# COPY --from=build /app/.env .   # optional
# COPY --from=build /app/config ./config

# Expose port
EXPOSE 5858

# Run the app
CMD ["node", "dist/server.js"]
