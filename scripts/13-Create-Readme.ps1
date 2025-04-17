# 13. Create Comprehensive README
# This script creates a comprehensive README file for the project

# Configuration
$SOLUTION_NAME = "PersonalityFramework"
$WORK_DIR = Join-Path $PWD "aspire-solution"
$LOG_FILE = Get-ChildItem -Path $WORK_DIR -Filter "aspire-setup-*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName

# Log function
function Write-Log {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $logMessage = "[$timestamp] $Message"
  Write-Host $logMessage
    
  # Only write to log file if it exists
  if (Test-Path $LOG_FILE) {
    Add-Content -Path $LOG_FILE -Value $logMessage
  }
}

# Error handling
function Handle-Error {
  param([string]$Message)
  Write-Log "ERROR: $Message"
  exit 1
}

# Create comprehensive README
function Create-ComprehensiveReadme {
  Write-Log "Creating comprehensive README..."
    
  # Change to workspace directory
  Set-Location $WORK_DIR
  if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
  $readmeContent = @"
# $SOLUTION_NAME

A cloud-native Personality Framework application built with .NET Aspire and Azure Arc.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Local Development](#local-development)
  - [Docker Development](#docker-development)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
  - [Azure Deployment](#azure-deployment)
  - [Azure Arc Deployment](#azure-arc-deployment)
- [CI/CD](#cicd)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Overview

This solution provides a personality assessment and analysis platform with the following components:

- .NET Aspire AppHost for local development and orchestration
- .NET Web API for backend services
- React frontend for user interface
- Azure Arc for Kubernetes deployment
- CI/CD pipelines for GitHub Actions and Azure DevOps

## Architecture

The application follows a microservices architecture pattern:

- **API Service**: .NET 8 Web API providing RESTful endpoints for personality assessments
- **Web Frontend**: React-based SPA for user interface
- **Shared Library**: Common models and utilities used across services
- **AppHost**: .NET Aspire orchestrator for local development
- **ServiceDefaults**: Shared configuration for all services

## Prerequisites

- .NET 8.0 SDK or later with Aspire workload
- Docker Desktop
- Node.js 18.x or later
- Azure CLI with Arc extensions (for Azure Arc deployment)
- Kubernetes cluster (for deployment)

## Getting Started

### Local Development

1. Clone this repository
2. Run the setup script:
   \`\`\`
   ./scripts/Setup-LocalDev.ps1
   \`\`\`
   Or on Linux/macOS:
   \`\`\`
   ./scripts/setup-local-dev.sh
   \`\`\`

3. Start the Aspire AppHost:
   \`\`\`
   dotnet run --project ${SOLUTION_NAME}.AppHost/${SOLUTION_NAME}.AppHost.csproj
   \`\`\`

4. Open the Aspire dashboard at https://localhost:18888

### Docker Development

1. Use the Docker Compose helper script:
   \`\`\`
   ./scripts/Docker-Compose.ps1 up
   \`\`\`
   Or on Linux/macOS:
   \`\`\`
   ./scripts/docker-compose.sh up
   \`\`\`

2. Access the services:
   - API: http://localhost:5000
   - Web: http://localhost:3000

## Project Structure

- **${SOLUTION_NAME}.AppHost**: Aspire orchestrator
- **${SOLUTION_NAME}.ServiceDefaults**: Reusable project for shared configuration
- **${SOLUTION_NAME}.Api**: .NET Web API
- **${SOLUTION_NAME}.Web**: React frontend app
- **${SOLUTION_NAME}.Shared**: Shared library
- **infra**: Infrastructure as Code
  - **k8s**: Kubernetes manifests
  - **arc**: Azure Arc configuration
  - **bicep**: Azure Bicep templates
- **.github/workflows**: GitHub Actions workflows
- **scripts**: Utility scripts

## Deployment

### Azure Deployment

1. Run the Azure deployment script:
   \`\`\`
   ./scripts/Deploy-Azure.ps1 -ResourceGroupName "${SOLUTION_NAME}Rg" -PostgresAdminPassword (ConvertTo-SecureString -String "YourSecurePassword" -AsPlainText -Force)
   \`\`\`
   Or on Linux/macOS:
   \`\`\`
   ./scripts/deploy-azure.sh ${SOLUTION_NAME}Rg "YourSecurePassword"
   \`\`\`

2. Follow the instructions displayed after deployment to push your Docker images and restart the web apps.

### Azure Arc Deployment

1. Ensure your Kubernetes cluster is connected to Azure Arc:
   \`\`\`
   ./scripts/Deploy-ToArc.ps1
   \`\`\`

2. Deploy the application using the CI/CD pipeline or manually:
   \`\`\`
   kubectl apply -f infra/k8s/
   \`\`\`

## CI/CD

This repository includes CI/CD configurations for:

- **GitHub Actions**: See `.github/workflows/build-deploy.yml`
- **Azure DevOps**: See `azure-pipelines.yml`

To use these pipelines, you'll need to configure the following secrets:

### GitHub Actions Secrets

- `AZURE_CREDENTIALS`: Azure service principal credentials
- `ACR_LOGIN_SERVER`: Azure Container Registry login server
- `ACR_USERNAME`: Azure Container Registry username
- `ACR_PASSWORD`: Azure Container Registry password

### Azure DevOps Variables

- `ACR_LOGIN_SERVER`: Azure Container Registry login server

## Scripts

The `scripts` directory contains various utility scripts:

- **Setup-LocalDev.ps1**: Sets up the local development environment
- **Docker-Compose.ps1**: Helper script for Docker Compose operations
- **Deploy-Azure.ps1**: Deploys the solution to Azure
- **Deploy-ToArc.ps1**: Connects a Kubernetes cluster to Azure Arc

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
"@
  Set-Content -Path "README.md" -Value $readmeContent
  
  Write-Log "Comprehensive README created successfully."
}

# Main function
function Main {
  Write-Log "Starting comprehensive README creation..."
    
  # Create comprehensive README
  Create-ComprehensiveReadme
    
  Write-Log "Comprehensive README creation completed."
}

# Execute the script
Main