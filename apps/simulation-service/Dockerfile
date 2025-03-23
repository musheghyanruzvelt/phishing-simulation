FROM node:18-alpine AS base
WORKDIR /app

# Copy root package.json and turbo.json
COPY package.json turbo.json ./

# Copy packages
COPY packages ./packages

# Copy the service
COPY apps/simulation-service ./apps/simulation-service


RUN yarn install

# Build with detailed logging
RUN npx turbo build --filter=simulation-service --verbosity=2

RUN find . -name "main.js" | grep simulation-service

# Start the service
CMD ["node", "apps/simulation-service/dist/apps/simulation-service/src/main.js"]