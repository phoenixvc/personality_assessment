# Architecture Overview

## System Architecture

The PersonalityFramework is built using .NET Aspire, a cloud-ready stack for building observable, production-ready, distributed applications.

### Components

1. **AppHost** - The orchestrator for the application, responsible for service discovery and configuration.
2. **API** - RESTful API service that provides the core functionality.
3. **Web** - Web frontend for the application.
4. **ServiceDefaults** - Shared configuration and defaults for all services.

### Architecture Diagram

`
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Web Frontend   │────▶│    API Service  │
│                 │     │                 │
└─────────────────┘     └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │                 │
                       │    Database     │
                       │                 │
                       └─────────────────┘
`

### Technology Stack

- **.NET Aspire** - For service orchestration and cloud-readiness
- **.NET 9** - For all services and components
- **Docker** - For containerization
- **Kubernetes** - For container orchestration in production
- **Azure Container Registry** - For storing Docker images
- **Azure Kubernetes Service** - For hosting the application in production

## Data Flow

1. User requests are received by the Web Frontend
2. Web Frontend makes API calls to the API Service
3. API Service processes the requests and interacts with the Database
4. Results are returned to the Web Frontend and displayed to the user

## Monitoring and Observability

The application includes:

- Health checks for all services
- Logging with structured logging
- Metrics collection
- Distributed tracing

