FROM node:18-alpine AS base
WORKDIR /app

# Copy root package.json and turbo.json
COPY package.json turbo.json ./

# Copy packages
COPY packages ./packages

# Copy the service
COPY apps/management-service ./apps/management-service


RUN yarn install

# Build the app
RUN npx turbo build --filter=management-service

# Start the service
CMD ["node", "apps/management-service/dist/apps/management-service/src/main.js"]