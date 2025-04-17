# 9. Create Documentation
# This script creates documentation for the Aspire + Arc solution

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

# Create documentation
function Create-Documentation {
   Write-Log "Creating documentation..."
    
   # Change to workspace directory
   Set-Location $WORK_DIR
   if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
   $readmeContent = @"
# ${SOLUTION_NAME}

A cloud-native Personality Framework application built with .NET Aspire and Azure Arc.

## Overview

This solution provides a personality assessment and analysis platform with the following components:

- .NET Aspire AppHost for local development and orchestration
- .NET Web API for backend services
- React frontend for user interface
- Azure Arc for Kubernetes deployment
- CI/CD pipelines for GitHub Actions and Azure DevOps

## Prerequisites

- .NET 8.0 SDK or later with Aspire workload
- Docker Desktop
- Node.js 18.x or later
- Azure CLI with Arc extensions (for Azure Arc deployment)
- Kubernetes cluster (for deployment)

## Getting Started

### Local Development

1. Clone this repository
2. Restore dependencies:
   ```
   dotnet restore
   ```
3. Start the Aspire AppHost:
   ```
   dotnet run --project ${SOLUTION_NAME}.AppHost/${SOLUTION_NAME}.AppHost.csproj
   ```
4. Open the Aspire dashboard at https://localhost:18888

### Running the React Frontend Separately

1. Navigate to the Web project:
   ```
   cd ${SOLUTION_NAME}.Web
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open http://localhost:3000 in your browser

## Deployment to Azure Arc

### Prerequisites

- An Azure subscription
- A Kubernetes cluster connected to Azure Arc
- Azure Container Registry

### Deployment Steps

1. Build and push Docker images:
   ```
   docker build -t <acr-name>.azurecr.io/${SOLUTION_NAME.ToLower()}-api:latest -f ${SOLUTION_NAME}.Api/Dockerfile .
   docker build -t <acr-name>.azurecr.io/${SOLUTION_NAME.ToLower()}-web:latest -f ${SOLUTION_NAME}.Web/Dockerfile ${SOLUTION_NAME}.Web
   
   docker push <acr-name>.azurecr.io/${SOLUTION_NAME.ToLower()}-api:latest
   docker push <acr-name>.azurecr.io/${SOLUTION_NAME.ToLower()}-web:latest
   ```

2. Connect your Kubernetes cluster to Azure Arc (if not already connected):
   ```
   cd infra/arc
   ./Deploy-ToArc.ps1
   ```
   
   Or using Bash:
   ```
   cd infra/arc
   ./deploy-to-arc.sh
   ```

3. Deploy the application to your Arc-connected cluster:
   ```
   kubectl apply -f ../k8s/api-deployment.yaml
   kubectl apply -f ../k8s/api-service.yaml
   kubectl apply -f ../k8s/web-deployment.yaml
   kubectl apply -f ../k8s/web-service.yaml
   kubectl apply -f ../k8s/ingress.yaml
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
"@
   Set-Content -Path "README.md" -Value $readmeContent
    
   Write-Log "Documentation created successfully."
}

# Main function
function Main {
   Write-Log "Starting documentation creation..."
    
   # Create documentation
   Create-Documentation
    
   Write-Log "Documentation creation completed."
}

# Execute the script
Main