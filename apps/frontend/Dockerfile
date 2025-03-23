FROM node:20-alpine AS base
WORKDIR /app

# Copy root package.json and turbo.json
COPY package.json turbo.json ./

# Copy packages
COPY packages ./packages

# Copy the frontend
COPY apps/frontend ./apps/frontend

# Install dependencies
RUN yarn install

# Build the app
RUN npx turbo build --filter=frontend

# Use nginx to serve the frontend
FROM nginx:alpine
COPY --from=base /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf