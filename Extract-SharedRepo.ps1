function Extract-SharedRepo {
    Write-Log "Extracting shared library repository..."

    Set-Location $WORK_DIR
    Copy-Item -Path "monorepo" -Destination "persona_shared" -Recurse
    if (-not $?) { Handle-Error "Failed to copy monorepo for shared extraction" }

    Set-Location persona_shared
    if (-not $?) { Handle-Error "Failed to change to persona_shared directory" }

    git filter-repo --path Shared/ --path Models/ --path-rename Shared/:src/ --path-rename Models/:src/Models/ --force
    if (-not $?) { Handle-Error "Failed to filter shared repo" }

    New-Item -ItemType Directory -Path temp_src -Force | Out-Null
    Move-Item -Path src\* -Destination temp_src -ErrorAction SilentlyContinue
    dotnet new classlib -n persona_shared
    if (-not $?) { Handle-Error "Failed to create classlib project" }

    New-Item -ItemType Directory -Path persona_shared\src -Force | Out-Null
    Move-Item -Path temp_src\* -Destination persona_shared\src -ErrorAction SilentlyContinue
    Remove-Item -Path temp_src -ErrorAction SilentlyContinue

    dotnet new sln -n persona_shared
    if (-not $?) { Handle-Error "Failed to create solution file" }
    dotnet sln add ./persona_shared/persona_shared.csproj
    if (-not $?) { Handle-Error "Failed to add project to solution" }

    $csprojContent = @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
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
    Set-Content -Path "./persona_shared/persona_shared.csproj" -Value $csprojContent

    $readmeContent = @"
# Persona Shared Library

Shared components and models for the Personality Framework ecosystem.

## Overview

This library contains shared models, constants, helpers, and utilities used across the Personality Framework projects:

- persona_api
- persona_web
- persona_app

## Installation

### Via NuGet (Recommended)

```
dotnet add package ${ORG_NAME}.Persona.Shared
```

### From Source

1. Clone this repository
2. Build the solution: `dotnet build`
3. Reference the built library in your project
"@
    Set-Content -Path "README.md" -Value $readmeContent

    git add .
    if (-not $?) { Handle-Error "Failed to stage changes for shared repo" }
    git commit -m "Restructure as standalone shared library"
    if (-not $?) { Handle-Error "Failed to commit changes for shared repo" }

    Write-Log "Shared library repository extracted successfully."
}
