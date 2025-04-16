function Create-DocsRepo {
    Write-Log "Creating documentation repository..."

    Set-Location $WORK_DIR
    New-Item -ItemType Directory -Path "persona_docs" -Force | Out-Null
    Set-Location persona_docs
    if (-not $?) { Handle-Error "Failed to change to persona_docs directory" }

    git init
    if (-not $?) { Handle-Error "Failed to initialize git repository for docs" }

    New-Item -ItemType Directory -Path "api", "web", "app", "shared", "guides" -Force | Out-Null

    $readmeContent = @"
# Personality Framework Documentation

Comprehensive documentation for the Personality Framework ecosystem.

## Overview

This repository contains documentation for all components of the Personality Framework:

- [API Documentation](./api/README.md)
- [Web Frontend Documentation](./web/README.md)
- [Mobile/Desktop App Documentation](./app/README.md)
- [Shared Library Documentation](./shared/README.md)
- [Developer Guides](./guides/README.md)

## Getting Started

Visit the [Getting Started Guide](./guides/getting-started.md) to set up your development environment.

## Repository Structure

The Personality Framework is split across multiple repositories:

- `persona_api`: Backend API
- `persona_web`: Web frontend
- `persona_shared`: Shared library
- `persona_app`: MAUI cross-platform app
- `persona_docs`: This documentation repository
"@
    Set-Content -Path "README.md" -Value $readmeContent

    $gettingStartedContent = @"
# Getting Started with Personality Framework Development

This guide will help you set up your development environment for working with the Personality Framework repositories.

## Prerequisites

- Git 2.x or later
- .NET 6.0 SDK or later
- Node.js 14.x or later
- Docker and Docker Compose (optional, for containerized development)

## Cloning the Repositories

```powershell
# Create a workspace directory
New-Item -ItemType Directory -Path "personality-framework-workspace"
Set-Location personality-framework-workspace

# Clone all repositories
git clone https://github.com/${ORG_NAME}/persona_api.git
git clone https://github.com/${ORG_NAME}/persona_web.git
git clone https://github.com/${ORG_NAME}/persona_shared.git
git clone https://github.com/${ORG_NAME}/persona_app.git
git clone https://github.com/${ORG_NAME}/persona_docs.git
```

## Setting Up the Development Environment

### Option 1: Local Development

1. Build and publish the shared library locally
2. Set up the API
3. Set up the Web frontend

### Option 2: Docker Compose

1. Create a `docker-compose.yml` file
2. Run `docker-compose up`

See the [Docker Development Guide](./docker-development.md) for more details.
"@
    Set-Content -Path "guides/getting-started.md" -Value $gettingStartedContent

    git add .
    if (-not $?) { Handle-Error "Failed to stage changes for docs repo" }
    git commit -m "Initial documentation structure"
    if (-not $?) { Handle-Error "Failed to commit changes for docs repo" }

    Write-Log "Documentation repository created successfully."
}
