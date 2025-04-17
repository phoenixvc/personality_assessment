# 10. Create Local Development Setup
# This script creates scripts for local development environment setup

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

# Create local development setup scripts
function Create-LocalDevSetup {
    Write-Log "Creating local development setup scripts..."
    
    # Change to workspace directory
    Set-Location $WORK_DIR
    if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
    # Create scripts directory if it doesn't exist
    $scriptsDir = "scripts"
    if (-not (Test-Path $scriptsDir)) {
        New-Item -ItemType Directory -Path $scriptsDir -Force | Out-Null
    }
    
    # Create PowerShell setup script
    $setupPsContent = @"
# Local Development Environment Setup for $SOLUTION_NAME
# This script sets up the local development environment

# Check for prerequisites
Write-Host "Checking prerequisites..."

# Check for .NET SDK
try {
    \$dotnetVersion = dotnet --version
    Write-Host ".NET SDK found: \$dotnetVersion"
}
catch {
    Write-Host "ERROR: .NET SDK not found. Please install .NET 8.0 SDK or later." -ForegroundColor Red
    exit 1
}

# Check for .NET Aspire workload
\$aspireInstalled = dotnet workload list | Select-String -Pattern "aspire" -Quiet
if (-not \$aspireInstalled) {
    Write-Host "Installing .NET Aspire workload..."
    dotnet workload install aspire
    if (-not \$?) {
        Write-Host "ERROR: Failed to install .NET Aspire workload." -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host ".NET Aspire workload is installed."
}

# Check for Node.js
try {
    \$nodeVersion = node --version
    Write-Host "Node.js found: \$nodeVersion"
}
catch {
    Write-Host "WARNING: Node.js not found. Please install Node.js 18.x or later for Web development." -ForegroundColor Yellow
}

# Check for Docker
try {
    \$dockerVersion = docker --version
    Write-Host "Docker found: \$dockerVersion"
}
catch {
    Write-Host "WARNING: Docker not found. Please install Docker Desktop for containerization." -ForegroundColor Yellow
}

# Restore dependencies
Write-Host "Restoring dependencies..."
dotnet restore
if (-not \$?) {
    Write-Host "ERROR: Failed to restore .NET dependencies." -ForegroundColor Red
    exit 1
}

# Setup Web project dependencies
if (Test-Path "$SOLUTION_NAME.Web") {
    Write-Host "Setting up Web project dependencies..."
    Push-Location "$SOLUTION_NAME.Web"
    npm install
    if (-not \$?) {
        Write-Host "WARNING: Failed to install npm dependencies." -ForegroundColor Yellow
    }
    Pop-Location
}

Write-Host "Local development environment setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the Aspire application, run:" -ForegroundColor Cyan
Write-Host "dotnet run --project $SOLUTION_NAME.AppHost/$SOLUTION_NAME.AppHost.csproj" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the Web frontend separately:" -ForegroundColor Cyan
Write-Host "cd $SOLUTION_NAME.Web" -ForegroundColor Cyan
Write-Host "npm start" -ForegroundColor Cyan
"@
    Set-Content -Path "$scriptsDir/Setup-LocalDev.ps1" -Value $setupPsContent
    
    # Create Bash setup script
    $setupShContent = @"
#!/bin/bash
# Local Development Environment Setup for $SOLUTION_NAME
# This script sets up the local development environment

# Check for prerequisites
echo "Checking prerequisites..."

# Check for .NET SDK
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=\$(dotnet --version)
    echo ".NET SDK found: \$DOTNET_VERSION"
else
    echo "ERROR: .NET SDK not found. Please install .NET 8.0 SDK or later."
    exit 1
fi

# Check for .NET Aspire workload
if dotnet workload list | grep -q "aspire"; then
    echo ".NET Aspire workload is installed."
else
    echo "Installing .NET Aspire workload..."
    dotnet workload install aspire
    if [ \$? -ne 0 ]; then
        echo "ERROR: Failed to install .NET Aspire workload."
        exit 1
    fi
fi

# Check for Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=\$(node --version)
    echo "Node.js found: \$NODE_VERSION"
else
    echo "WARNING: Node.js not found. Please install Node.js 18.x or later for Web development."
fi

# Check for Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=\$(docker --version)
    echo "Docker found: \$DOCKER_VERSION"
else
    echo "WARNING: Docker not found. Please install Docker Desktop for containerization."
fi

# Restore dependencies
echo "Restoring dependencies..."
dotnet restore
if [ \$? -ne 0 ]; then
    echo "ERROR: Failed to restore .NET dependencies."
    exit 1
fi

# Setup Web project dependencies
if [ -d "$SOLUTION_NAME.Web" ]; then
    echo "Setting up Web project dependencies..."
    pushd "$SOLUTION_NAME.Web"
    npm install
    if [ \$? -ne 0 ]; then
        echo "WARNING: Failed to install npm dependencies."
    fi
    popd
fi

echo "Local development environment setup completed successfully!"
echo ""
echo "To start the Aspire application, run:"
echo "dotnet run --project $SOLUTION_NAME.AppHost/$SOLUTION_NAME.AppHost.csproj"
echo ""
echo "To run the Web frontend separately:"
echo "cd $SOLUTION_NAME.Web"
echo "npm start"
"@
    Set-Content -Path "$scriptsDir/setup-local-dev.sh" -Value $setupShContent
  
    # Make bash script executable
    if ($IsLinux -or $IsMacOS) {
        chmod +x "$scriptsDir/setup-local-dev.sh"
    }
    
    Write-Log "Local development setup scripts created successfully."
}

# Main function
function Main {
    Write-Log "Starting local development setup script creation..."
    
    # Create local development setup
    Create-LocalDevSetup
    
    Write-Log "Local development setup script creation completed."
}

# Execute the script
Main