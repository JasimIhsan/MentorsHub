# Use official Node.js image as base
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first (to leverage caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the application port
EXPOSE 5858

# Start the application
CMD ["npm", "start"]
