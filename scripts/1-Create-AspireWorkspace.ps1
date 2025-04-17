# 1. Create Aspire Workspace
# This script creates the initial workspace for the Aspire + Arc solution

# Configuration
$SOLUTION_NAME = "PersonalityFramework"
$WORK_DIR = Join-Path $PWD "aspire-solution"
$DATE_STAMP = Get-Date -Format "yyyyMMddHHmmss"
$LOG_FILE = Join-Path $WORK_DIR "aspire-setup-$DATE_STAMP.log"
$ORG_NAME = "phoenixvc"

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

# Create workspace directory
function Create-Workspace {
    Write-Log "Creating workspace directory: $WORK_DIR"
    New-Item -ItemType Directory -Path $WORK_DIR -Force | Out-Null
    if (-not $?) { Handle-Error "Failed to create workspace directory" }

    # Create log file
    New-Item -ItemType File -Path $LOG_FILE -Force | Out-Null
    if (-not $?) { Handle-Error "Failed to create log file" }

    Write-Log "Workspace created successfully."
}

# Main function
function Main {
    Write-Log "Starting Aspire workspace creation..."
    
    # Create workspace
    Create-Workspace
    
    Write-Log "Aspire workspace created successfully at $WORK_DIR"
}

# Execute the script
Main