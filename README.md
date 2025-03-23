# Phishing Simulation Platform

A comprehensive phishing simulation platform built with a microservice architecture, allowing security teams to create, manage, and track phishing campaigns.

## Project Management with Turborepo

This project uses Turborepo, a high-performance build system for JavaScript and TypeScript monorepos. Turborepo enables:

- 🚀 Faster builds and deployments
- 📦 Efficient dependency management
- 🔄 Parallel task execution
- 💾 Intelligent caching

## Features

- 🔐 User authentication and authorization
- 📧 Create and manage phishing campaigns
- 📨 Send realistic phishing emails
- 📊 Track email opens and link clicks
- ⚡ Real-time notifications via WebSockets

## Project Overview

This project consists of three main services:

- **Management Service**: Admin dashboard for creating and tracking phishing campaigns
- **Simulation Service**: Handles the sending of phishing emails and tracking clicks
- **Frontend**: React-based UI for interacting with the platform

## Prerequisites

- Node.js (v18+)
- Yarn
- Turborepo
- Docker (optional)
- RabbitMQ
- MongoDB


## Message Broker Setup

### RabbitMQ Setup

1. **Local Installation**:
   - Download and install RabbitMQ from the official website
   - Recommended version: 3.9 or later
   - Ensure RabbitMQ management plugin is enabled
   - Default port: 5672 (AMQP), 15672 (Management UI)

## Project Structure

```
phishing-simulation/
├── apps/
│   ├── frontend/             # React frontend application
│   ├── management-service/   # NestJS service for managing phishing campaigns
│   └── simulation-service/   # NestJS service for sending and tracking emails
├── packages/                 # Shared packages
│   ├── schemas/              # Shared MongoDB schemas
│   └── types/                # Shared TypeScript interfaces
├── turbo.json                # Turborepo configuration
└── package.json              # Root package management
```

## Getting Started

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/phishing-simulation.git
cd phishing-simulation
```

2. Install dependencies

```bash
# Install root and workspace dependencies
yarn install
```

### Running Services

1. Start all services in development mode

```bash
# Using Turborepo
turbo dev

# Alternatively, individually
cd apps/management-service
yarn dev

cd apps/simulation-service
yarn dev

cd apps/frontend
yarn dev
```

2. Run specific service

```bash
# Run only management service
turbo dev --filter=management-service
```

### Docker Deployment

1. Build and start all services

```bash
docker-compose up -d
```

2. Stop all services

```bash
docker-compose down
```

## Development Workflow

- Use `turbo` for workspace-wide commands
- Shared code goes in the `packages/` directory
- Service-specific code remains in `apps/`
- Use workspace dependencies for sharing types, schemas, and utilities

## Continuous Integration

Turborepo enables efficient CI/CD by:
- Caching build outputs
- Running only affected services
- Parallel task execution

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
