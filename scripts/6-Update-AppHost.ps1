# 6. Update AppHost
# This script updates the AppHost project to include all components

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

# Update AppHost
function Update-AppHost {
    Write-Log "Updating AppHost to include all components..."
    
    # Change to workspace directory
    Set-Location $WORK_DIR
    if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
    # Update Program.cs in AppHost
    $appHostProgramContent = @"
var builder = DistributedApplication.CreateBuilder(args);

// Add API service
var api = builder.AddProject<Projects.${SOLUTION_NAME}_Api>("api")
    .WithEndpoint("https", "https://localhost:5001", "API Endpoint");

// Add Web frontend as a container
var web = builder.AddContainer("web", "${SOLUTION_NAME.ToLower()}-web")
    .WithEndpoint("http", "http://localhost:3000", "Web Frontend")
    .WithReference(api);

// Add PostgreSQL database (optional)
// var postgres = builder.AddPostgres("postgres");
// api.WithReference(postgres);

builder.Build().Run();
"@
    Set-Content -Path "${SOLUTION_NAME}.AppHost/Program.cs" -Value $appHostProgramContent
    
    Write-Log "AppHost updated successfully."
}

# Main function
function Main {
    Write-Log "Starting AppHost update..."
    
    # Update AppHost
    Update-AppHost
    
    Write-Log "AppHost update completed."
}

# Execute the script
Main