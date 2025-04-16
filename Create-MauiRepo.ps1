function Create-MauiRepo {
    Write-Log "Creating MAUI app repository..."

    Set-Location $WORK_DIR
    New-Item -ItemType Directory -Path "persona_app" -Force | Out-Null
    Set-Location persona_app
    if (-not $?) { Handle-Error "Failed to change to persona_app directory" }

    git init
    if (-not $?) { Handle-Error "Failed to initialize git repository for MAUI app" }

    dotnet new maui -n PersonaApp
    if (-not $?) { Handle-Error "Failed to create MAUI project" }

    dotnet new sln -n persona_app
    if (-not $?) { Handle-Error "Failed to create solution file" }
    dotnet sln add PersonaApp/PersonaApp.csproj
    if (-not $?) { Handle-Error "Failed to add project to solution" }

    $readmeContent = @"
# Persona App

MAUI-based cross-platform application for the Personality Framework ecosystem.

## Overview

This multi-platform app provides a native experience for personality assessments on desktop and mobile devices.

## Requirements

- .NET 6.0 SDK or later
- MAUI workload installed (`dotnet workload install maui`)
- Visual Studio 2022 or JetBrains Rider for best development experience

## Getting Started

1. Clone this repository
2. Restore dependencies: `dotnet restore`
3. Build the app: `dotnet build`
4. Run the app: `dotnet run --project PersonaApp/PersonaApp.csproj`

## Supported Platforms

- Windows 10/11
- macOS
- iOS
- Android
"@
    Set-Content -Path "README.md" -Value $readmeContent

    git add .
    if (-not $?) { Handle-Error "Failed to stage changes for MAUI app repo" }
    git commit -m "Initial MAUI app structure"
    if (-not $?) { Handle-Error "Failed to commit changes for MAUI app repo" }

    Write-Log "MAUI app repository created successfully."
}
