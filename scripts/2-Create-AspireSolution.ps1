# 2. Create Aspire Solution
# This script creates the basic Aspire solution structure

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

# Check .NET SDK version and install required workloads
function Check-Prerequisites {
    Write-Log "Checking prerequisites..."
    
    # Check .NET SDK
    try {
        $dotnetVersion = dotnet --version
        Write-Log "Found .NET SDK version: $dotnetVersion"
        
        # Check if .NET version is 8.0 or higher (required for Aspire)
        $majorVersion = [int]($dotnetVersion.Split('.')[0])
        if ($majorVersion -lt 8) {
            Write-Log "Warning: .NET Aspire requires .NET 8.0 or higher. Current version: $dotnetVersion"
            Write-Log "Please upgrade your .NET SDK to continue."
            return $false
        }
    }
    catch {
        Write-Log "Error: .NET SDK not found. Please install .NET 8.0 SDK or higher."
        return $false
    }
    
    # Check if .NET Aspire workload is installed
    try {
        $workloads = dotnet workload list
        if (-not ($workloads -match "aspire")) {
            Write-Log ".NET Aspire workload not found. Installing..."
            dotnet workload install aspire
            if (-not $?) { 
                Write-Log "Error: Failed to install .NET Aspire workload."
                return $false
            }
        }
    }
    catch {
        Write-Log "Error checking .NET workloads: $_"
        return $false
    }
    
    Write-Log "Prerequisites check completed successfully."
    return $true
}

# Create Aspire solution structure
function Create-AspireSolution {
    Write-Log "Creating Aspire solution structure..."
    
    # Change to workspace directory
    Set-Location $WORK_DIR
    if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
    # Create solution
    dotnet new sln -n $SOLUTION_NAME
    if (-not $?) { Handle-Error "Failed to create solution" }
    
    # Create Aspire AppHost project
    Write-Log "Creating Aspire AppHost project..."
    dotnet new aspire-host -n "${SOLUTION_NAME}.AppHost"
    if (-not $?) { Handle-Error "Failed to create Aspire AppHost project" }
    
    # Create ServiceDefaults project
    Write-Log "Creating ServiceDefaults project..."
    dotnet new aspire-servicedefaults -n "${SOLUTION_NAME}.ServiceDefaults"
    if (-not $?) { Handle-Error "Failed to create ServiceDefaults project" }
    
    # Add projects to solution
    dotnet sln add "${SOLUTION_NAME}.AppHost/${SOLUTION_NAME}.AppHost.csproj"
    dotnet sln add "${SOLUTION_NAME}.ServiceDefaults/${SOLUTION_NAME}.ServiceDefaults.csproj"
    
    Write-Log "Basic Aspire solution structure created."
}

# Main function
function Main {
    Write-Log "Starting Aspire solution creation..."
    
    # Check prerequisites
    $prereqsOk = Check-Prerequisites
    if (-not $prereqsOk) {
        Handle-Error "Prerequisites check failed. Please address the issues and try again."
    }
    
    # Create solution structure
    Create-AspireSolution
    
    Write-Log "Aspire solution created successfully."
}

# Execute the script
Main