#!/bin/bash
# Personality Framework Repository Splitter
# This script automates the process of splitting a monorepo into multiple repositories

# Configuration
MONOREPO_URL="https://github.com/phoenixvc/personality-framework.git"
ORG_NAME="phoenixvc"
WORK_DIR="$(pwd)/repo-split-workspace"
DATE_STAMP=$(date +%Y%m%d%H%M%S)
LOG_FILE="$WORK_DIR/repo-split-$DATE_STAMP.log"

# Repositories to create
REPOS=(
  "persona_api"
  "persona_web"
  "persona_shared"
  "persona_app"
  "persona_docs"
)

# Log function
log() {
  echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $1" | tee -a "$LOG_FILE"
}

# Error handling
handle_error() {
  log "ERROR: $1"
  exit 1
}

# Check if git-filter-repo is installed
check_dependencies() {
  log "Checking dependencies..."
  
  if ! command -v git-filter-repo &> /dev/null; then
    log "git-filter-repo is not installed. Attempting to install..."
    
    if command -v pip3 &> /dev/null; then
      pip3 install git-filter-repo || handle_error "Failed to install git-filter-repo with pip3"
    elif command -v brew &> /dev/null; then
      brew install git-filter-repo || handle_error "Failed to install git-filter-repo with Homebrew"
    else
      handle_error "Please install git-filter-repo manually: https://github.com/newren/git-filter-repo"
    fi
  fi
  
  log "All dependencies are satisfied."
}

# Create workspace directory
create_workspace() {
  log "Creating workspace directory: $WORK_DIR"
  mkdir -p "$WORK_DIR" || handle_error "Failed to create workspace directory"
  
  # Create log file
  touch "$LOG_FILE" || handle_error "Failed to create log file"
  
  log "Workspace created successfully."
}

# Clone the monorepo
clone_monorepo() {
  log "Cloning the monorepo..."
  
  cd "$WORK_DIR" || handle_error "Failed to change to workspace directory"
  git clone "$MONOREPO_URL" monorepo || handle_error "Failed to clone the monorepo"
  
  # Create a backup branch
  cd monorepo || handle_error "Failed to change to monorepo directory"
  git checkout -b monorepo-backup || handle_error "Failed to create backup branch"
  
  # We won't push the backup branch as we don't have write access in this script
  log "Created local backup branch: monorepo-backup"
  
  git checkout main || git checkout master || handle_error "Failed to checkout main/master branch"
  
  log "Monorepo cloned successfully."
}

# Extract shared library repository
extract_shared_repo() {
  log "Extracting shared library repository..."
  
  cd "$WORK_DIR" || handle_error "Failed to change to workspace directory"
  cp -r monorepo persona_shared || handle_error "Failed to copy monorepo for shared extraction"
  
  cd persona_shared || handle_error "Failed to change to persona_shared directory"
  
  # Extract only shared code paths
  git filter-repo --path Shared/ --path Models/ --path-rename Shared/:src/ --path-rename Models/:src/Models/ --force || handle_error "Failed to filter shared repo"
  
  # Create a new .NET Class Library project
  mkdir -p temp_src
  mv src/* temp_src/ 2>/dev/null || true
  dotnet new classlib -n persona_shared || handle_error "Failed to create classlib project"
  mkdir -p persona_shared/src
  mv temp_src/* persona_shared/src/ 2>/dev/null || true
  rmdir temp_src 2>/dev/null || true
  
  # Create a solution file
  dotnet new sln -n persona_shared || handle_error "Failed to create solution file"
  dotnet sln add ./persona_shared/persona_shared.csproj || handle_error "Failed to add project to solution"
  
  # Update the .csproj file
  cat > ./persona_shared/persona_shared.csproj << EOF
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
EOF
  
  # Create a basic README
  cat > README.md << EOF
# Persona Shared Library

Shared components and models for the Personality Framework ecosystem.

## Overview

This library contains shared models, constants, helpers, and utilities used across the Personality Framework projects:

- persona_api
- persona_web
- persona_app

## Installation

### Via NuGet (Recommended)

\`\`\`
dotnet add package ${ORG_NAME}.Persona.Shared
\`\`\`

### From Source

1. Clone this repository
2. Build the solution: \`dotnet build\`
3. Reference the built library in your project
EOF
  
  # Commit the changes
  git add . || handle_error "Failed to stage changes for shared repo"
  git commit -m "Restructure as standalone shared library" || handle_error "Failed to commit changes for shared repo"
  
  log "Shared library repository extracted successfully."
}

# Extract API repository
extract_api_repo() {
  log "Extracting API repository..."
  
  cd "$WORK_DIR" || handle_error "Failed to change to workspace directory"
  cp -r monorepo persona_api || handle_error "Failed to copy monorepo for API extraction"
  
  cd persona_api || handle_error "Failed to change to persona_api directory"
  
  # Extract only API code paths
  git filter-repo --path Controllers/ --path Services/ --path Data/ --path appsettings.json --path Program.cs --path Startup.cs --path "*.csproj" --force || handle_error "Failed to filter API repo"
  
  # Rename the project file if needed
  if [ -f "personality-framework.csproj" ]; then
    mv personality-framework.csproj persona_api.csproj || handle_error "Failed to rename project file"
  fi
  
  # Create a solution file
  dotnet new sln -n persona_api || handle_error "Failed to create solution file"
  dotnet sln add persona_api.csproj || handle_error "Failed to add project to solution"
  
  # Create a basic README
  cat > README.md << EOF
# Persona API

Backend API for the Personality Framework ecosystem.

## Overview

This API provides endpoints for personality assessments, data analysis, and framework integration.

## Requirements

- .NET 6.0 SDK or later
- SQL Server or PostgreSQL database

## Getting Started

1. Clone this repository
2. Update the connection string in \`appsettings.json\`
3. Run database migrations: \`dotnet ef database update\`
4. Start the API: \`dotnet run\`

## Dependencies

- ${ORG_NAME}.Persona.Shared - Shared models and utilities
EOF
  
  # Commit the changes
  git add . || handle_error "Failed to stage changes for API repo"
  git commit -m "Restructure as standalone API project" || handle_error "Failed to commit changes for API repo"
  
  log "API repository extracted successfully."
}

# Extract web frontend repository
extract_web_repo() {
  log "Extracting web frontend repository..."
  
  cd "$WORK_DIR" || handle_error "Failed to change to workspace directory"
  cp -r monorepo persona_web || handle_error "Failed to copy monorepo for web extraction"
  
  cd persona_web || handle_error "Failed to change to persona_web directory"
  
  # Extract only web frontend code paths
  git filter-repo --path ClientApp/ --path-rename ClientApp/:. --force || handle_error "Failed to filter web repo"
  
  # Update package.json name if it exists
  if [ -f "package.json" ]; then
    if command -v jq &> /dev/null; then
      jq '.name = "persona_web"' package.json > package.json.new && mv package.json.new package.json
    else
      log "Warning: jq not installed, package.json name not updated"
    fi
  fi
  
  # Create a basic README
  cat > README.md << EOF
# Persona Web

Web frontend for the Personality Framework ecosystem.

## Overview

This React application provides a user interface for personality assessments, visualization, and analysis.

## Requirements

- Node.js 14.x or later
- npm 6.x or later

## Getting Started

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm start\`

## Environment Variables

Create a \`.env\` file with the following variables:

\`\`\`
REACT_APP_API_URL=http://localhost:5000
\`\`\`
EOF
  
  # Commit the changes
  git add . || handle_error "Failed to stage changes for web repo"
  git commit -m "Restructure as standalone web frontend" || handle_error "Failed to commit changes for web repo"
  
  log "Web frontend repository extracted successfully."
}

# Create MAUI app repository
create_maui_repo() {
  log "Creating MAUI app repository..."
  
  cd "$WORK_DIR" || handle_error "Failed to change to workspace directory"
  mkdir -p persona_app || handle_error "Failed to create persona_app directory"
  cd persona_app || handle_error "Failed to change to persona_app directory"
  
  # Initialize git repository
  git init || handle_error "Failed to initialize git repository for MAUI app"
  
  # Create a basic MAUI project
  dotnet new maui -n PersonaApp || handle_error "Failed to create MAUI project"
  
  # Create a solution file
  dotnet new sln -n persona_app || handle_error "Failed to create solution file"
  dotnet sln add PersonaApp/PersonaApp.csproj || handle_error "Failed to add project to solution"
  
  # Create a basic README
  cat > README.md << EOF
# Persona App

MAUI-based cross-platform application for the Personality Framework ecosystem.

## Overview

This multi-platform app provides a native experience for personality assessments on desktop and mobile devices.

## Requirements

- .NET 6.0 SDK or later
- MAUI workload installed (\`dotnet workload install maui\`)
- Visual Studio 2022 or JetBrains Rider for best development experience

## Getting Started

1. Clone this repository
2. Restore dependencies: \`dotnet restore\`
3. Build the app: \`dotnet build\`
4. Run the app: \`dotnet run --project PersonaApp/PersonaApp.csproj\`

## Supported Platforms

- Windows 10/11
- macOS
- iOS
- Android
EOF
  
  # Commit the changes
  git add . || handle_error "Failed to stage changes for MAUI app repo"
  git commit -m "Initial MAUI app structure" || handle_error "Failed to commit changes for MAUI app repo"
  
  log "MAUI app repository created successfully."
}

# Create documentation repository
create_docs_repo() {
  log "Creating documentation repository..."
  
  cd "$WORK_DIR" || handle_error "Failed to change to workspace directory"
  mkdir -p persona_docs || handle_error "Failed to create persona_docs directory"
  cd persona_docs || handle_error "Failed to change to persona_docs directory"
  
  # Initialize git repository
  git init || handle_error "Failed to initialize git repository for docs"
  
  # Create basic documentation structure
  mkdir -p {api,web,app,shared,guides}
  
  # Create main README
  cat > README.md << EOF
# Personality Framework Documentation

Comprehensive documentation for the Personality Framework ecosystem.

## Overview

This repository contains documentation for all components of the Personality Framework:

- [API Documentation](./api/README.md)
- [Web Frontend Documentation](./web/README.md)
- [Mobile/Desktop App Documentation](./app/README.md)
- [Shared Library Documentation](./shared/README.md)
- [Developer Guides](./guides/README.md)

## Getting Started

Visit the [Getting Started Guide](./guides/getting-started.md) to set up your development environment.

## Repository Structure

The Personality Framework is split across multiple repositories:

- \`persona_api\`: Backend API
- \`persona_web\`: Web frontend
- \`persona_shared\`: Shared library
- \`persona_app\`: MAUI cross-platform app
- \`persona_docs\`: This documentation repository
EOF
  
  # Create the repo split guide
  mkdir -p guides
  cat > guides/repo-split-guide.md << EOF
# Splitting the Personality Framework Monorepo

This guide documents the process used to split the original monorepo into multiple specialized repositories.

## Project Structure Overview

### Original Monorepo Structure

\`\`\`
/personality-framework/
├── ClientApp/              # React web frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── Controllers/            # API controllers
├── Models/                 # Shared data models
├── Services/               # Backend services
├── Data/                   # Database context and migrations
├── Shared/                 # Shared utilities and types
│   ├── Constants/
│   └── Helpers/
├── .github/                # CI/CD workflows
├── personality-framework.csproj
└── appsettings.json
\`\`\`

### New Multi-Repo Structure

\`\`\`
/repos/
├── persona_api/            # Backend API
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Data/
│   └── persona_api.csproj
│
├── persona_web/            # React web frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── persona_shared/         # Shared library
│   ├── Constants/
│   ├── Helpers/
│   └── persona_shared.csproj
│
├── persona_app/            # MAUI app
│   └── PersonaApp/
│
└── persona_docs/           # Documentation
    └── guides/
\`\`\`

## Benefits of Multi-Repo Approach

- **Focused Repositories**: Each repository has a clear, single responsibility
- **Independent Versioning**: Components can be versioned independently
- **Simplified CI/CD**: Build and deployment pipelines are simpler and faster
- **Team Autonomy**: Teams can work on different components without interference
- **Reduced Build Times**: Only build what has changed
- **Clear Boundaries**: Better separation of concerns between components

## Local Development Setup

See the [Local Development Guide](./local-development.md) for instructions on setting up your development environment.
EOF
  
  # Create getting started guide
  cat > guides/getting-started.md << EOF
# Getting Started with Personality Framework Development

This guide will help you set up your development environment for working with the Personality Framework repositories.

## Prerequisites

- Git 2.x or later
- .NET 6.0 SDK or later
- Node.js 14.x or later
- Docker and Docker Compose (optional, for containerized development)

## Cloning the Repositories

\`\`\`bash
# Create a workspace directory
mkdir personality-framework-workspace
cd personality-framework-workspace

# Clone all repositories
git clone https://github.com/${ORG_NAME}/persona_api.git
git clone https://github.com/${ORG_NAME}/persona_web.git
git clone https://github.com/${ORG_NAME}/persona_shared.git
git clone https://github.com/${ORG_NAME}/persona_app.git
git clone https://github.com/${ORG_NAME}/persona_docs.git
\`\`\`

## Setting Up the Development Environment

### Option 1: Local Development

1. **Build and publish the shared library locally**

   \`\`\`bash
   cd persona_shared
   dotnet build
   dotnet pack -o ../local-packages
   \`\`\`

2. **Set up the API**

   \`\`\`bash
   cd ../persona_api
   dotnet add package ${ORG_NAME}.Persona.Shared --source ../local-packages
   dotnet build
   dotnet run
   \`\`\`

3. **Set up the Web frontend**

   \`\`\`bash
   cd ../persona_web
   npm install
   npm start
   \`\`\`

### Option 2: Docker Compose

1. Create a \`docker-compose.yml\` file in your workspace directory
2. Run \`docker-compose up\`

See the [Docker Development Guide](./docker-development.md) for more details.

## Contributing

Please see the [Contribution Guidelines](./contributing.md) for information on how to contribute to the project.
EOF
  
  # Create local development guide
  cat > guides/local-development.md << EOF
# Local Development Guide

This guide explains how to set up a local development environment for the Personality Framework.

## Docker Compose Setup

Create a \`docker-compose.yml\` file in your workspace directory:

\`\`\`yaml
version: '3.8'

services:
  api:
    build:
      context: ./persona_api
      dockerfile: Dockerfile.dev
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    volumes:
      - ./persona_api:/app
      - /app/bin
      - /app/obj

  web:
    build:
      context: ./persona_web
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - REACT_APP_API_URL=http://localhost:5000
    volumes:
      - ./persona_web:/app
      - /app/node_modules
    depends_on:
      - api
\`\`\`

## Development Coordination Script

Create a \`dev.sh\` script in your workspace directory:

\`\`\`bash
#!/bin/bash
# dev.sh - Development environment coordinator

function clone_repos() {
  # Clone all repositories if they don't exist
  if [ ! -d "./persona_shared" ]; then
    git clone https://github.com/${ORG_NAME}/persona_shared.git
  fi
  
  if [ ! -d "./persona_api" ]; then
    git clone https://github.com/${ORG_NAME}/persona_api.git
  fi
  
  if [ ! -d "./persona_web" ]; then
    git clone https://github.com/${ORG_NAME}/persona_web.git
  fi
  
  if [ ! -d "./persona_app" ]; then
    git clone https://github.com/${ORG_NAME}/persona_app.git
  fi
  
  if [ ! -d "./persona_docs" ]; then
    git clone https://github.com/${ORG_NAME}/persona_docs.git
  fi
}

function update_repos() {
  # Update all repositories
  echo "Updating shared library..."
  cd ./persona_shared
  git pull
  cd ..
  
  echo "Updating API..."
  cd ./persona_api
  git pull
  cd ..
  
  echo "Updating web frontend..."
  cd ./persona_web
  git pull
  cd ..
  
  echo "Updating MAUI app..."
  cd ./persona_app
  git pull
  cd ..
  
  echo "Updating documentation..."
  cd ./persona_docs
  git pull
  cd ..
}

function start_dev() {
  docker-compose up -d
  echo "Development environment started at:"
  echo "- API: http://localhost:5000"
  echo "- Web: http://localhost:3000"
}

function stop_dev() {
  docker-compose down
  echo "Development environment stopped."
}

# Main script logic
case "$1" in
  clone)
    clone_repos
    ;;
  update)
    update_repos
    ;;
  start)
    start_dev
    ;;
  stop)
    stop_dev
    ;;
  *)
    echo "Usage: $0 {clone|update|start|stop}"
    exit 1
    ;;
esac

exit 0
\`\`\`

Make the script executable:

\`\`\`bash
chmod +x dev.sh
\`\`\`

## Using the Development Script

- \`./dev.sh clone\`: Clone all repositories
- \`./dev.sh update\`: Update all repositories
- \`./dev.sh start\`: Start the development environment
- \`./dev.sh stop\`: Stop the development environment
EOF
  
  # Commit the changes
  git add . || handle_error "Failed to stage changes for docs repo"
  git commit -m "Initial documentation structure" || handle_error "Failed to commit changes for docs repo"
  
  log "Documentation repository created successfully."
}

# Create GitHub repositories
create_github_repos() {
  log "Note: This script cannot automatically create GitHub repositories."
  log "Please create the following repositories manually on GitHub:"
  
  for repo in "${REPOS[@]}"; do
    log "- https://github.com/$ORG_NAME/$repo"
  done
  
  log "After creating the repositories, you can push the local repositories using:"
  log "cd \$repo && git remote add origin https://github.com/$ORG_NAME/\$repo.git && git push -u origin main"
}

# Main execution
main() {
  log "Starting repository split process..."
  
  check_dependencies
  create_workspace
  clone_monorepo
  extract_shared_repo
  extract_api_repo
  extract_web_repo
  create_maui_repo
  create_docs_repo
  create_github_repos
  
  log "Repository split completed successfully!"
  log "The split repositories are available in: $WORK_DIR"
  log "Next steps:"
  log "1. Create the GitHub repositories (if not already done)"
  log "2. Push each repository to GitHub"
  log "3. Set up CI/CD for each repository"
  log "4. Update references between repositories"
}

# Execute main function
main