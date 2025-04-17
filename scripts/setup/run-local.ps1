# Run Local script for PersonalityFramework
# This script runs the application locally

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
Write-Log "Starting PersonalityFramework locally..."

# Check if Docker is running
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Log "WARNING: Docker is not running. Starting Docker..."
        
        # Check if we're on Windows
        if ($env:OS -match 'Windows') {
            # Try to start Docker Desktop
            Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
            
            # Wait for Docker to start
            Write-Log "Waiting for Docker to start..."
            $retries = 0
            $maxRetries = 30
            
            while ($retries -lt $maxRetries) {
                Start-Sleep -Seconds 2
                docker info > $null 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Log "Docker started successfully."
                    break
                }
                $retries++
                Write-Log "Waiting for Docker to start ($retries/$maxRetries)..."
            }
            
            if ($retries -eq $maxRetries) {
                Exit-WithError "Docker failed to start within the timeout period."
            }
        } else {
            Exit-WithError "Docker is not running. Please start Docker and try again."
        }
    }
} catch {
    Exit-WithError "Failed to check Docker status. Is Docker installed?"
}

# Run the application
Write-Log "Running PersonalityFramework..."
try {
    dotnet run --project PersonalityFramework.AppHost
    if ($LASTEXITCODE -ne 0) {
        Exit-WithError "Failed to run the application."
    }
} catch {
    Exit-WithError "Failed to run the application: $($_.Exception.Message)"
}
