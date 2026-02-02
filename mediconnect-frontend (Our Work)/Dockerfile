# Use Node.js 20 on Alpine Linux
FROM node:20-alpine

WORKDIR /app

# Enable Corepack (comes with Node 20)
RUN corepack enable

# Copy dependency files first (better caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy rest of the app
COPY . .

EXPOSE 5173

# Run Vite
CMD ["yarn", "dev", "--host", "0.0.0.0"]

