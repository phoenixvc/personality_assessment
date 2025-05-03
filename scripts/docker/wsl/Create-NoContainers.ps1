# PowerShell script to create a no-containers version of Aspire project

# ANSI color codes for formatting
$colors = @{
  Reset   = "`e[0m"
  Bright  = "`e[1m"
  Green   = "`e[32m"
  Yellow  = "`e[33m"
  Blue    = "`e[34m"
  Magenta = "`e[35m"
  Cyan    = "`e[36m"
  Red     = "`e[31m"
}

Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)    Creating No-Containers Aspire Project$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

# Function to create a no-containers version of the Aspire project
function Create-NoContainersAspire {
  Write-Host "$($colors.Yellow)Creating a no-containers version of your Aspire project...$($colors.Reset)"
    
  try {
    # Find the Aspire project directory
    $aspireDir = Join-Path -Path (Get-Location) -ChildPath "aspire\PersonalityFramework.AppHost"
        
    if (-not (Test-Path -Path $aspireDir)) {
      Write-Host "$($colors.Yellow)Could not find Aspire project directory at $aspireDir$($colors.Reset)"
      Write-Host "$($colors.Yellow)Please run this script from the root of your project.$($colors.Reset)"
      return $false
    }
        
    # Create NoContainers directory
    $noContainersDir = Join-Path -Path $aspireDir -ChildPath "NoContainers"
    if (-not (Test-Path -Path $noContainersDir)) {
      New-Item -Path $noContainersDir -ItemType Directory -Force | Out-Null
    }
        
    # Create project file
    $csprojContent = @"
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <IsAspireHost>true</IsAspireHost>
    <RootNamespace>PersonalityFramework.AppHost.NoContainers</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference Include="..\\..\\PersonalityFramework.Api\\PersonalityFramework.Api.csproj" />
    <ProjectReference Include="..\\..\\PersonalityFramework.Web\\PersonalityFramework.Web.csproj" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Hosting" Version="8.0.0-preview.3.24165.12" />
  </ItemGroup>

</Project>
"@
        
    Set-Content -Path (Join-Path -Path $noContainersDir -ChildPath "PersonalityFramework.AppHost.NoContainers.csproj") -Value $csprojContent
        
    # Create Program.cs
    $programContent = @"
using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// Note: This version avoids using containers for MongoDB
// You'll need to have MongoDB installed locally or use a cloud instance

// Use a direct connection to a local or cloud MongoDB instance
var mongoConnectionString = "mongodb://localhost:27017";
// Alternatively, use MongoDB Atlas or another cloud provider
// var mongoConnectionString = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>";

// Add API project with MongoDB connection
var api = builder.AddProject<Projects.PersonalityFramework_Api>("api")
                .WithEnvironment("DatabaseSettings__ConnectionString", mongoConnectionString);

// Add Web project with reference to API
var web = builder.AddProject<Projects.PersonalityFramework_Web>("web")
                .WithReference(api);

// Build and run the application
builder.Build().Run();
"@
        
    Set-Content -Path (Join-Path -Path $noContainersDir -ChildPath "Program.cs") -Value $programContent
        
    # Create Properties directory and launchSettings.json
    $propertiesDir = Join-Path -Path $noContainersDir -ChildPath "Properties"
    if (-not (Test-Path -Path $propertiesDir)) {
      New-Item -Path $propertiesDir -ItemType Directory -Force | Out-Null
    }
        
    $launchSettingsContent = @"
{
  "profiles": {
    "PersonalityFramework.AppHost.NoContainers": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "http://localhost:15000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "DOTNET_ENVIRONMENT": "Development",
        "DOTNET_DASHBOARD_OTLP_ENDPOINT_URL": "http://localhost:18888"
      }
    }
  }
}
"@
        
    Set-Content -Path (Join-Path -Path $propertiesDir -ChildPath "launchSettings.json") -Value $launchSettingsContent
        
    # Update package.json if it exists
    try {
      $packageJsonPath = Join-Path -Path (Get-Location) -ChildPath "package.json"
      if (Test-Path -Path $packageJsonPath) {
        $packageJson = Get-Content -Path $packageJsonPath -Raw | ConvertFrom-Json
                
        if (-not $packageJson.scripts) {
          $packageJson | Add-Member -MemberType NoteProperty -Name "scripts" -Value @{}
        }
                
        $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "start:aspire:no-containers" -Value "dotnet run --project aspire/PersonalityFramework.AppHost/NoContainers/PersonalityFramework.AppHost.NoContainers.csproj" -Force
                
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path $packageJsonPath
        Write-Host "$($colors.Green)Added 'start:aspire:no-containers' script to package.json$($colors.Reset)"
      }
    }
    catch {
      Write-Host "$($colors.Yellow)Could not update package.json: $($_.Exception.Message)$($colors.Reset)"
    }
        
    $readmeContent = @"
# Running Aspire Without Containers

This project allows you to run the Aspire application without using Docker containers.

## Prerequisites

1. Install MongoDB locally:
   - Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register

2. Update the connection string in `Program.cs` if needed.

## Running the Application

Run the application using:
Run the application using:
"@

    Set-Content -Path (Join-Path -Path $noContainersDir -ChildPath "README.md") -Value $readmeContent
        
    Write-Host "$($colors.Green)No-containers version of Aspire project created successfully.$($colors.Reset)"
    return $true
  }
  catch {
    Write-Host "$($colors.Red)Error creating no-containers version of Aspire project: $($_.Exception.Message)$($colors.Reset)"
    return $false
  }
}

# Run the function
$result = Create-NoContainersAspire
if ($result) {
  Write-Host "$($colors.Green)No-containers Aspire project creation completed.$($colors.Reset)"
}
else {
  Write-Host "$($colors.Red)Failed to create no-containers Aspire project.$($colors.Reset)"
}