FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install Turbo globally
RUN npm install -g turbo

# Install dependencies only when needed
FROM base AS deps
COPY package.json package-lock.json* ./
COPY packages ./packages
COPY apps/*/package.json ./apps/

# Install dependencies
RUN yarn install