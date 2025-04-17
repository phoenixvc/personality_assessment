# Docker Compose Helper Script for PersonalityFramework
# This script provides commands for working with Docker Compose

param(
  [Parameter(Position = 0)]
  [ValidateSet("up", "down", "build", "restart", "logs", "status", "clean")]
  [string]\ = "up"
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
  param([string]\, [string]\ = "")
  
  \ = "docker-compose \ \"
  Write-Host "Executing: \" -ForegroundColor Cyan
  Invoke-Expression \
}

switch (\) {
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
