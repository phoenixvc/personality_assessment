function Extract-WebRepo {
    Write-Log "Extracting web frontend repository..."

    Set-Location $WORK_DIR
    Copy-Item -Path "monorepo" -Destination "persona_web" -Recurse
    if (-not $?) { Handle-Error "Failed to copy monorepo for web extraction" }

    Set-Location persona_web
    if (-not $?) { Handle-Error "Failed to change to persona_web directory" }

    git filter-repo --path ClientApp/ --path-rename ClientApp/:. --force
    if (-not $?) { Handle-Error "Failed to filter web repo" }

    if (Test-Path "package.json") {
        if (Get-Command npm -ErrorAction SilentlyContinue) {
            $packageJson = Get-Content "package.json" | ConvertFrom-Json
            $packageJson.name = "persona_web"
            $packageJson | ConvertTo-Json -Depth 100 | Set-Content "package.json"
        }
        else {
            Write-Log "Warning: npm not installed, package.json name not updated"
        }
    }

    $readmeContent = @"
# Persona Web

Web frontend for the Personality Framework ecosystem.

## Overview

This React application provides a user interface for personality assessments, visualization, and analysis.

## Requirements

- Node.js 14.x or later
- npm 6.x or later

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Environment Variables

Create a `.env` file with the following variables:

```
REACT_APP_API_URL=http://localhost:5000
```
"@
    Set-Content -Path "README.md" -Value $readmeContent

    git add .
    if (-not $?) { Handle-Error "Failed to stage changes for web repo" }
    git commit -m "Restructure as standalone web frontend"
    if (-not $?) { Handle-Error "Failed to commit changes for web repo" }

    Write-Log "Web frontend repository extracted successfully."
}
