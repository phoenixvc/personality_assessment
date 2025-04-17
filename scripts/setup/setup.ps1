# Setup script for PersonalityFramework
# This script sets up the local development environment

# Log function
function Write-Log {
    param([string])
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
Write-Log "Starting PersonalityFramework setup..."

# Check prerequisites
Write-Log "Checking prerequisites..."

# Check .NET SDK
try {
    $dotnetVersion = dotnet --version
    Write-Log ".NET SDK version: $dotnetVersion"
    
    # Check if .NET version is 9.0 or higher
    if (-not ($dotnetVersion -match '^9\.')) {
        Write-Log "WARNING: This project requires .NET 9.0 or higher. You have $dotnetVersion"
        
        $installChoice = Read-Host "Would you like to install .NET 9.0? (y/n)"
        if ($installChoice -eq 'y') {
            Write-Log "Installing .NET 9.0..."
            winget install Microsoft.DotNet.SDK.9
            
            # Verify installation
            $newDotnetVersion = dotnet --version
            if (-not ($newDotnetVersion -match '^9\.')) {
                Exit-WithError "Failed to install .NET 9.0. Please install it manually."
            }
            
            Write-Log ".NET 9.0 installed successfully."
        } else {
            Exit-WithError "This project requires .NET 9.0 or higher. Please install it and try again."
        }
    }
} catch {
    Exit-WithError ".NET SDK not found. Please install .NET 9.0 SDK or higher."
}

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Log "Docker version: $dockerVersion"
} catch {
    Write-Log "WARNING: Docker not found. Some features may not work without Docker."
    
    $installChoice = Read-Host "Would you like to install Docker Desktop? (y/n)"
    if ($installChoice -eq 'y') {
        Write-Log "Please download and install Docker Desktop from https://www.docker.com/products/docker-desktop"
        Start-Process "https://www.docker.com/products/docker-desktop"
        
        Write-Log "After installing Docker Desktop, please run this script again."
        exit 0
    }
}

# Check Aspire workload
try {
    $workloads = dotnet workload list
    if (-not ($workloads -match 'aspire')) {
        Write-Log "Installing .NET Aspire workload..."
        dotnet workload install aspire
        
        if ($LASTEXITCODE -ne 0) {
            Exit-WithError "Failed to install .NET Aspire workload."
        }
        
        Write-Log ".NET Aspire workload installed successfully."
    } else {
        Write-Log ".NET Aspire workload is already installed."
    }
} catch {
    Exit-WithError "Failed to check or install .NET Aspire workload."
}

# Restore packages
Write-Log "Restoring NuGet packages..."
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Exit-WithError "Failed to restore NuGet packages."
}

Write-Log "Setup completed successfully."
Write-Log "You can now run the application using: dotnet run --project PersonalityFramework.AppHost"
