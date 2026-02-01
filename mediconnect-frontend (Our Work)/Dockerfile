# Use Node.js 20 on Alpine Linux (Lightweight)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install Yarn explicitly
RUN npm install -g yarn

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
