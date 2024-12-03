# Stage 1: Build the frontend
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project files into the working directory
COPY . .

# Build the frontend (assumes a React app or similar)
RUN npm run build

# Stage 2: Serve the frontend
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the build artifacts from the "build" stage
COPY --from=build /app/build /app

# Install 'serve' globally to serve the static files
RUN npm install -g serve

# Expose port 3000 for the frontend
EXPOSE 3000

# Serve the frontend using 'serve'
CMD ["serve", "-s", "."]