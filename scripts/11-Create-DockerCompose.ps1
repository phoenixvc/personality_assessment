# 11. Create Docker Compose Setup
# This script creates Docker Compose files for local container development

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

# Create Docker Compose setup
function Create-DockerComposeSetup {
  Write-Log "Creating Docker Compose setup..."
    
  # Change to workspace directory
  Set-Location $WORK_DIR
  if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
  # Create Docker Compose file
  $dockerComposeContent = @"
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: ${SOLUTION_NAME}.Api/Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:80;https://+:443
    depends_on:
      - postgres
    networks:
      - ${SOLUTION_NAME.ToLower()}-network

  web:
    build:
      context: ${SOLUTION_NAME}.Web
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - api
    networks:
      - ${SOLUTION_NAME.ToLower()}-network

  postgres:
    image: postgres:latest
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${SOLUTION_NAME.ToLower()}db
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - ${SOLUTION_NAME.ToLower()}-network

volumes:
  postgres-data:

networks:
  ${SOLUTION_NAME.ToLower()}-network:
    driver: bridge
"@
  Set-Content -Path "docker-compose.yml" -Value $dockerComposeContent
  
  # Create Docker Compose override file for development
  $dockerComposeOverrideContent = @"
version: '3.8'

services:
  api:
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:80;https://+:443
    volumes:
      - ${SOLUTION_NAME}.Api:/app
    ports:
      - "5000:80"
      - "5001:443"

  web:
    build:
      target: development
    volumes:
      - ./node_modules:/app/node_modules
      - ./src:/app/src
    environment:
      - NODE_ENV=development
    ports:
      - "3000:3000"
    command: npm start
"@
  Set-Content -Path "docker-compose.override.yml" -Value $dockerComposeOverrideContent
  
  # Create Docker Compose helper script
  $scriptsDir = "scripts"
  if (-not (Test-Path $scriptsDir)) {
    New-Item -ItemType Directory -Path $scriptsDir -Force | Out-Null
  }
  
  $dockerComposeScriptContent = @"
# Docker Compose Helper Script for $SOLUTION_NAME
# This script provides commands for working with Docker Compose

param(
  [Parameter(Position = 0)]
  [ValidateSet("up", "down", "build", "restart", "logs", "status", "clean")]
  [string]\$Command = "up"
)

function Show-Usage {
  Write-Host "Usage: .\Docker-Compose.ps1 [command]"
  Write-Host ""
  Write-Host "Commands:"
  Write-Host "  up      - Start all services (default)"
  Write-Host "  down    - Stop all services"
  Write-Host "  build   - Rebuild all services"
  Write-Host "  restart - Restart all services"
  Write-Host "  logs    - Show logs from all services"
  Write-Host "  status  - Show status of services"
  Write-Host "  clean   - Remove all containers, images, and volumes"
  Write-Host ""
}

function Execute-DockerCompose {
  param([string]\$DockerCommand, [string]\$Arguments = "")
  
  \$fullCommand = "docker-compose \$DockerCommand \$Arguments"
  Write-Host "Executing: \$fullCommand" -ForegroundColor Cyan
  Invoke-Expression \$fullCommand
}

switch (\$Command) {
  "up" {
    Execute-DockerCompose "up -d"
    Write-Host ""
    Write-Host "Services are starting..." -ForegroundColor Green
    Write-Host "API will be available at: http://localhost:5000" -ForegroundColor Green
    Write-Host "Web UI will be available at: http://localhost:3000" -ForegroundColor Green
  }
  "down" {
    Execute-DockerCompose "down"
  }
  "build" {
    Execute-DockerCompose "build --no-cache"
  }
  "restart" {
    Execute-DockerCompose "restart"
  }
  "logs" {
    Execute-DockerCompose "logs -f"
  }
  "status" {
    Execute-DockerCompose "ps"
  }
  "clean" {
    Execute-DockerCompose "down -v --rmi all --remove-orphans"
  }
  default {
    Show-Usage
  }
}
"@
  Set-Content -Path "$scriptsDir/Docker-Compose.ps1" -Value $dockerComposeScriptContent
  
  # Create Bash version of the helper script
  $dockerComposeShScriptContent = @"
#!/bin/bash
# Docker Compose Helper Script for $SOLUTION_NAME
# This script provides commands for working with Docker Compose

function show_usage {
  echo "Usage: ./docker-compose.sh [command]"
  echo ""
  echo "Commands:"
  echo "  up      - Start all services (default)"
  echo "  down    - Stop all services"
  echo "  build   - Rebuild all services"
  echo "  restart - Restart all services"
  echo "  logs    - Show logs from all services"
  echo "  status  - Show status of services"
  echo "  clean   - Remove all containers, images, and volumes"
  echo ""
}

function execute_docker_compose {
  local docker_command=\$1
  local arguments=\$2
  
  local full_command="docker-compose \$docker_command \$arguments"
  echo "Executing: \$full_command"
  eval \$full_command
}

# Default command is "up"
COMMAND=\${1:-up}

case \$COMMAND in
  up)
    execute_docker_compose "up -d"
    echo ""
    echo "Services are starting..."
    echo "API will be available at: http://localhost:5000"
    echo "Web UI will be available at: http://localhost:3000"
    ;;
  down)
    execute_docker_compose "down"
    ;;
  build)
    execute_docker_compose "build --no-cache"
    ;;
  restart)
    execute_docker_compose "restart"
    ;;
  logs)
    execute_docker_compose "logs -f"
    ;;
  status)
    execute_docker_compose "ps"
    ;;
  clean)
    execute_docker_compose "down -v --rmi all --remove-orphans"
    ;;
  *)
    show_usage
    ;;
esac
"@
  Set-Content -Path "$scriptsDir/docker-compose.sh" -Value $dockerComposeShScriptContent
  
  # Make bash script executable
  if ($IsLinux -or $IsMacOS) {
    chmod +x "$scriptsDir/docker-compose.sh"
  }
  
  Write-Log "Docker Compose setup created successfully."
}

# Main function
function Main {
  Write-Log "Starting Docker Compose setup creation..."
    
  # Create Docker Compose setup
  Create-DockerComposeSetup
    
  Write-Log "Docker Compose setup creation completed."
}

# Execute the script
Main