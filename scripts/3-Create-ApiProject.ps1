# 3. Create API Project
# This script creates the API project in the Aspire solution

# Configuration
$SOLUTION_NAME = "PersonalityFramework"
$WORK_DIR = Join-Path $PWD "aspire-solution"
$SOURCE_API_PATH = Join-Path $PWD "OceanPersonalityApi"
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

# Create API project
function Create-ApiProject {
    Write-Log "Creating API project..."
    
    # Change to workspace directory
    Set-Location $WORK_DIR
    if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
    $targetApiPath = Join-Path $WORK_DIR "${SOLUTION_NAME}.Api"
    
    # Check if source API exists
    if (Test-Path $SOURCE_API_PATH) {
        Write-Log "Source API found at $SOURCE_API_PATH"
        
        # Create target directory
        New-Item -ItemType Directory -Path $targetApiPath -Force | Out-Null
        if (-not $?) { Handle-Error "Failed to create target API directory" }
        
        # Copy existing API files
        Write-Log "Copying API files from $SOURCE_API_PATH to $targetApiPath"
        Copy-Item -Path "$SOURCE_API_PATH\*" -Destination $targetApiPath -Recurse -Force
        if (-not $?) { Handle-Error "Failed to copy API files" }
        
        # Rename project file if needed
        $csprojPath = Get-ChildItem -Path $targetApiPath -Filter "*.csproj" | Select-Object -First 1
        if ($csprojPath) {
            if ($csprojPath.Name -ne "${SOLUTION_NAME}.Api.csproj") {
                Rename-Item -Path $csprojPath.FullName -NewName "${SOLUTION_NAME}.Api.csproj"
                Write-Log "Renamed project file to ${SOLUTION_NAME}.Api.csproj"
            }
        }
    }
    else {
        Write-Log "Source API not found at $SOURCE_API_PATH"
        Write-Log "Creating new API project..."
        
        # Create new API project
        dotnet new webapi -n "${SOLUTION_NAME}.Api"
        if (-not $?) { Handle-Error "Failed to create API project" }
    }
    
    # Add to solution
    dotnet sln add "${SOLUTION_NAME}.Api/${SOLUTION_NAME}.Api.csproj"
    if (-not $?) { Handle-Error "Failed to add API project to solution" }
    
    # Reference ServiceDefaults from API
    dotnet add "${SOLUTION_NAME}.Api/${SOLUTION_NAME}.Api.csproj" reference "${SOLUTION_NAME}.ServiceDefaults/${SOLUTION_NAME}.ServiceDefaults.csproj"
    if (-not $?) { Handle-Error "Failed to add reference to ServiceDefaults" }
    
    # Reference API from AppHost
    dotnet add "${SOLUTION_NAME}.AppHost/${SOLUTION_NAME}.AppHost.csproj" reference "${SOLUTION_NAME}.Api/${SOLUTION_NAME}.Api.csproj"
    if (-not $?) { Handle-Error "Failed to add reference to API from AppHost" }
    
    # Create Dockerfile for the API
    $dockerfilePath = Join-Path $targetApiPath "Dockerfile"
    if (-not (Test-Path $dockerfilePath)) {
        $dockerfileContent = @"
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["${SOLUTION_NAME}.Api/${SOLUTION_NAME}.Api.csproj", "${SOLUTION_NAME}.Api/"]
COPY ["${SOLUTION_NAME}.ServiceDefaults/${SOLUTION_NAME}.ServiceDefaults.csproj", "${SOLUTION_NAME}.ServiceDefaults/"]
RUN dotnet restore "${SOLUTION_NAME}.Api/${SOLUTION_NAME}.Api.csproj"
COPY . .
WORKDIR "/src/${SOLUTION_NAME}.Api"
RUN dotnet build "${SOLUTION_NAME}.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "${SOLUTION_NAME}.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "${SOLUTION_NAME}.Api.dll"]
"@
        Set-Content -Path $dockerfilePath -Value $dockerfileContent
        Write-Log "Created Dockerfile for API project"
    }
    
    Write-Log "API project created successfully."
}

# Main function
function Main {
    Write-Log "Starting API project creation..."
    
    # Create API project
    Create-ApiProject
    
    Write-Log "API project creation completed."
}

# Execute the script
Main