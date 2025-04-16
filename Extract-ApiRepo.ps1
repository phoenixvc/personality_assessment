function Extract-ApiRepo {
    Write-Log "Extracting API repository..."

    Set-Location $WORK_DIR
    Copy-Item -Path "monorepo" -Destination "persona_api" -Recurse
    if (-not $?) { Handle-Error "Failed to copy monorepo for API extraction" }

    Set-Location persona_api
    if (-not $?) { Handle-Error "Failed to change to persona_api directory" }

    git filter-repo --path Controllers/ --path Services/ --path Data/ --path appsettings.json --path Program.cs --path Startup.cs --path "*.csproj" --force
    if (-not $?) { Handle-Error "Failed to filter API repo" }

    if (Test-Path "personality-framework.csproj") {
        Rename-Item "personality-framework.csproj" "persona_api.csproj"
        if (-not $?) { Handle-Error "Failed to rename project file" }
    }

    dotnet new sln -n persona_api
    if (-not $?) { Handle-Error "Failed to create solution file" }
    dotnet sln add persona_api.csproj
    if (-not $?) { Handle-Error "Failed to add project to solution" }

    $readmeContent = @"
# Persona API

Backend API for the Personality Framework ecosystem.

## Overview

This API provides endpoints for personality assessments, data analysis, and framework integration.

## Requirements

- .NET 6.0 SDK or later
- SQL Server or PostgreSQL database

## Getting Started

1. Clone this repository
2. Update the connection string in `appsettings.json`
3. Run database migrations: `dotnet ef database update`
4. Start the API: `dotnet run`

## Dependencies

- ${ORG_NAME}.Persona.Shared - Shared models and utilities
"@
    Set-Content -Path "README.md" -Value $readmeContent

    git add .
    if (-not $?) { Handle-Error "Failed to stage changes for API repo" }
    git commit -m "Restructure as standalone API project"
    if (-not $?) { Handle-Error "Failed to commit changes for API repo" }

    Write-Log "API repository extracted successfully."
}
