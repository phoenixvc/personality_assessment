# Docker Compose Run script for PersonalityFramework
# This script runs the application using Docker Compose

# Log function
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message"
}

# Error handling
function Exit-WithError {
    param([string]$Message)
    Write-Log "ERROR: $Message"
    exit 1
}

# Main script
Write-Log "Starting PersonalityFramework with Docker Compose..."

# Check if Docker is running
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Exit-WithError "Docker is not running. Please start Docker and try again."
    }
} catch {
    Exit-WithError "Failed to check Docker status. Is Docker installed?"
}

# Run docker-compose
Write-Log "Running docker-compose up..."
try {
    docker-compose up --build
    if ($LASTEXITCODE -ne 0) {
        Exit-WithError "Failed to run docker-compose."
    }
} catch {
    Exit-WithError "Failed to run docker-compose: $($_.Exception.Message)"
}
