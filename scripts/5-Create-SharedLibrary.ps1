# 5. Create Shared Library
# This script creates the Shared library in the Aspire solution

# Configuration
$SOLUTION_NAME = "PersonalityFramework"
$WORK_DIR = Join-Path $PWD "aspire-solution"
$SOURCE_SHARED_PATH = Join-Path $PWD "Models"  # Adjust this path to your actual shared library location
$LOG_FILE = Get-ChildItem -Path $WORK_DIR -Filter "aspire-setup-*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName
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

# Create Shared Library
function Create-SharedLibrary {
    Write-Log "Creating Shared Library..."
    
    # Change to workspace directory
    Set-Location $WORK_DIR
    if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
    $targetSharedPath = Join-Path $WORK_DIR "${SOLUTION_NAME}.Shared"
    
    # Create Shared Library project
    dotnet new classlib -n "${SOLUTION_NAME}.Shared"
    if (-not $?) { Handle-Error "Failed to create shared library project" }
    
    # Add to solution
    dotnet sln add "${SOLUTION_NAME}.Shared/${SOLUTION_NAME}.Shared.csproj"
    if (-not $?) { Handle-Error "Failed to add shared library to solution" }
    
    # Check if source Shared library exists
    if (Test-Path $SOURCE_SHARED_PATH) {
        Write-Log "Source Shared library found at $SOURCE_SHARED_PATH"
        
        # Create Models directory in target
        New-Item -ItemType Directory -Path "$targetSharedPath\Models" -Force | Out-Null
        
        # Copy existing Shared library files
        Write-Log "Copying Shared library files from $SOURCE_SHARED_PATH to $targetSharedPath\Models"
        Copy-Item -Path "$SOURCE_SHARED_PATH\*" -Destination "$targetSharedPath\Models" -Recurse -Force
        if (-not $?) { Write-Log "Warning: Some files may not have copied correctly" }
    }
    else {
        Write-Log "Source Shared library not found at $SOURCE_SHARED_PATH"
        Write-Log "Creating sample model classes..."
        
        # Create sample model classes
        New-Item -ItemType Directory -Path "${SOLUTION_NAME}.Shared/Models" -Force | Out-Null
        
        $personalityModelContent = @"
namespace ${SOLUTION_NAME}.Shared.Models
{
    public class PersonalityAssessment
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<PersonalityDimension> Dimensions { get; set; } = new List<PersonalityDimension>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class PersonalityDimension
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Score { get; set; }
    }
}
"@
        Set-Content -Path "${SOLUTION_NAME}.Shared/Models/PersonalityModels.cs" -Value $personalityModelContent
    }
    
    # Update Shared Library project file
    $csprojContent = @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <PackageId>${ORG_NAME}.Persona.Shared</PackageId>
    <Version>1.0.0</Version>
    <Authors>${ORG_NAME}</Authors>
    <Company>${ORG_NAME}</Company>
    <Description>Shared components for the Personality Framework</Description>
  </PropertyGroup>
</Project>
"@
    Set-Content -Path "${SOLUTION_NAME}.Shared/${SOLUTION_NAME}.Shared.csproj" -Value $csprojContent
    
    # Add reference to Shared from API
    dotnet add "${SOLUTION_NAME}.Api/${SOLUTION_NAME}.Api.csproj" reference "${SOLUTION_NAME}.Shared/${SOLUTION_NAME}.Shared.csproj"
    if (-not $?) { Handle-Error "Failed to add reference to Shared Library from API" }
    
    Write-Log "Shared Library created successfully."
}

# Main function
function Main {
    Write-Log "Starting Shared Library creation..."
    
    # Create Shared Library
    Create-SharedLibrary
    
    Write-Log "Shared Library creation completed."
}

# Execute the script
Main