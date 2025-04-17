import React from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const RepoSplitGuide: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Splitting the Personality Framework Monorepo</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Project Structure Overview</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Current Monorepo Structure</h3>
            <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`/personality-framework/
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
└── appsettings.json`}
            </SyntaxHighlighter>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Target Multi-Repo Structure</h3>
            <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`/repos/
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
└── persona_app/            # Future MAUI app
    └── (to be created)`}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 1: Prepare the Monorepo</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">1.1 Create a Fresh Clone</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Clone the monorepo
git clone https://github.com/your-org/personality-framework.git
cd personality-framework

# Create a backup branch just in case
git checkout -b monorepo-backup
git push origin monorepo-backup
git checkout main`}
          </SyntaxHighlighter>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">1.2 Install git-filter-repo</h3>
          <p className="mb-3">We'll use git-filter-repo instead of git-filter-branch as it's more efficient and safer.</p>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# On macOS with Homebrew
brew install git-filter-repo

# On Ubuntu/Debian
apt-get install git-filter-repo

# Or via pip
pip3 install git-filter-repo`}
          </SyntaxHighlighter>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 2: Create the Shared Library Repository First</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">2.1 Extract Shared Code with History</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Clone a fresh copy for the shared repo extraction
git clone https://github.com/your-org/personality-framework.git persona_shared
cd persona_shared

# Extract only the shared code paths
git filter-repo --path Shared/ --path Models/ --path-rename Shared/:src/ --path-rename Models/:src/Models/ --force`}
          </SyntaxHighlighter>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">2.2 Set Up the Shared Library Project</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Create a new .NET Class Library project
dotnet new classlib -n persona_shared

# Move files to the correct structure
mv src/* ./persona_shared/

# Create a solution file
dotnet new sln -n persona_shared
dotnet sln add ./persona_shared/persona_shared.csproj

# Update the .csproj file to include package information
# (Edit manually or use the following commands)
cat > ./persona_shared/persona_shared.csproj << EOF
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <PackageId>YourOrg.Persona.Shared</PackageId>
    <Version>1.0.0</Version>
    <Authors>Your Organization</Authors>
    <Company>Your Organization</Company>
    <Description>Shared components for the Personality Framework</Description>
  </PropertyGroup>
</Project>
EOF

# Commit the changes
git add .
git commit -m "Restructure as standalone shared library"

# Create the remote repository and push
# (Create the repo on GitHub/GitLab/etc. first)
git remote set-url origin https://github.com/your-org/persona_shared.git
git push -u origin main`}
          </SyntaxHighlighter>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">2.3 Publish the Shared Package</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Package the library
dotnet pack ./persona_shared/persona_shared.csproj -c Release -o ./nupkg

# Push to your private NuGet feed
# (Replace with your actual feed URL and API key)
dotnet nuget push ./nupkg/*.nupkg --source "https://nuget.pkg.github.com/your-org/index.json" --api-key YOUR_API_KEY`}
          </SyntaxHighlighter>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 3: Create the API Repository</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">3.1 Extract API Code with History</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Clone a fresh copy for the API repo extraction
git clone https://github.com/your-org/personality-framework.git persona_api
cd persona_api

# Extract only the API code paths
git filter-repo --path Controllers/ --path Services/ --path Data/ --path appsettings.json --path Program.cs --path Startup.cs --path personality-framework.csproj --force`}
          </SyntaxHighlighter>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">3.2 Update API Project to Reference Shared Library</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Rename the project file
mv personality-framework.csproj persona_api.csproj

# Update the .csproj file to reference the shared package
# (Edit manually to add the package reference)
# Add this line in the ItemGroup section:
# <PackageReference Include="YourOrg.Persona.Shared" Version="1.0.0" />

# Update namespaces in code files if needed
# (This might require manual editing or a script)

# Create a solution file
dotnet new sln -n persona_api
dotnet sln add persona_api.csproj

# Commit the changes
git add .
git commit -m "Restructure as standalone API project"

# Create the remote repository and push
# (Create the repo on GitHub/GitLab/etc. first)
git remote set-url origin https://github.com/your-org/persona_api.git
git push -u origin main`}
          </SyntaxHighlighter>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 4: Create the Web Frontend Repository</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">4.1 Extract Web Frontend Code with History</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Clone a fresh copy for the web repo extraction
git clone https://github.com/your-org/personality-framework.git persona_web
cd persona_web

# Extract only the web frontend code paths
git filter-repo --path ClientApp/ --path-rename ClientApp/:. --force`}
          </SyntaxHighlighter>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">4.2 Update Web Frontend Configuration</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Update API endpoint configuration
# Edit src/setupProxy.js or similar files to point to the new API URL

# Update package.json with the correct project name
# (Edit manually or use jq)
jq '.name = "persona_web"' package.json > package.json.new && mv package.json.new package.json

# Commit the changes
git add .
git commit -m "Restructure as standalone web frontend"

# Create the remote repository and push
# (Create the repo on GitHub/GitLab/etc. first)
git remote set-url origin https://github.com/your-org/persona_web.git
git push -u origin main`}
          </SyntaxHighlighter>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 5: Set Up CI/CD for Each Repository</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">5.1 Shared Library CI/CD</h3>
          <SyntaxHighlighter language="yaml" style={tomorrow} className="rounded-lg">
{`# .github/workflows/build-and-publish.yml
name: Build and Publish

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 6.0.x
    - name: Restore dependencies
      run: dotnet restore
    - name: Build
      run: dotnet build --no-restore --configuration Release
    - name: Test
      run: dotnet test --no-build --configuration Release
    - name: Pack
      if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/v')
      run: dotnet pack --no-build --configuration Release -o nupkg
    - name: Push to NuGet
      if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/v')
      run: dotnet nuget push ./nupkg/*.nupkg --source https://nuget.pkg.github.com/your-org/index.json --api-key \${{ secrets.GITHUB_TOKEN }}`}
          </SyntaxHighlighter>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">5.2 API CI/CD</h3>
          <SyntaxHighlighter language="yaml" style={tomorrow} className="rounded-lg">
{`# .github/workflows/build-and-deploy.yml
name: Build and Deploy API

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 6.0.x
    - name: Add NuGet Source
      run: dotnet nuget add source https://nuget.pkg.github.com/your-org/index.json --name github --username \${{ github.actor }} --password \${{ secrets.GITHUB_TOKEN }}
    - name: Restore dependencies
      run: dotnet restore
    - name: Build
      run: dotnet build --no-restore --configuration Release
    - name: Test
      run: dotnet test --no-build --configuration Release
    - name: Publish
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      run: dotnet publish --no-build --configuration Release -o publish
    - name: Deploy
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      # Add your deployment steps here (Azure, AWS, etc.)`}
          </SyntaxHighlighter>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">5.3 Web Frontend CI/CD</h3>
          <SyntaxHighlighter language="yaml" style={tomorrow} className="rounded-lg">
{`# .github/workflows/build-and-deploy.yml
name: Build and Deploy Web

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Build
      run: npm run build
    - name: Test
      run: npm test
    - name: Deploy
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      # Add your deployment steps here (Azure, Netlify, Vercel, etc.)`}
          </SyntaxHighlighter>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 6: Set Up Local Development Environment</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">6.1 Create a Development Docker Compose Setup</h3>
          <SyntaxHighlighter language="yaml" style={tomorrow} className="rounded-lg">
{`# docker-compose.yml
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
      - api`}
          </SyntaxHighlighter>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">6.2 Create a Development Coordination Script</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`#!/bin/bash
# dev.sh - Development environment coordinator

function clone_repos() {
  mkdir -p ./repos
  cd ./repos
  
  # Clone all repositories if they don't exist
  if [ ! -d "./persona_shared" ]; then
    git clone https://github.com/your-org/persona_shared.git
  fi
  
  if [ ! -d "./persona_api" ]; then
    git clone https://github.com/your-org/persona_api.git
  fi
  
  if [ ! -d "./persona_web" ]; then
    git clone https://github.com/your-org/persona_web.git
  fi
  
  cd ..
}

function update_repos() {
  cd ./repos
  
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

exit 0`}
          </SyntaxHighlighter>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 7: Prepare for Future MAUI App</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">7.1 Create the MAUI App Repository Structure</h3>
          <SyntaxHighlighter language="bash" style={tomorrow} className="rounded-lg">
{`# Create the MAUI app repository
mkdir persona_app
cd persona_app

# Initialize git repository
git init

# Create a basic MAUI project
dotnet new maui -n PersonaApp

# Add reference to the shared library
dotnet add PersonaApp/PersonaApp.csproj package YourOrg.Persona.Shared

# Create a solution file
dotnet new sln -n persona_app
dotnet sln add PersonaApp/PersonaApp.csproj

# Create a basic README
cat > README.md << EOF
# Persona App

MAUI-based cross-platform application for the Personality Framework.

## Requirements

- .NET 6.0 SDK or later
- MAUI workload installed

## Getting Started

1. Clone this repository
2. Run \`dotnet restore\`
3. Run \`dotnet build\`
4. Run \`dotnet run --project PersonaApp/PersonaApp.csproj\`
EOF

# Create initial commit
git add .
git commit -m "Initial MAUI app structure"

# Create the remote repository and push
# (Create the repo on GitHub/GitLab/etc. first)
git remote add origin https://github.com/your-org/persona_app.git
git push -u origin main`}
          </SyntaxHighlighter>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 8: Documentation and Knowledge Transfer</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">8.1 Create a Project Wiki or Documentation Site</h3>
          <p className="mb-3">Document the new repository structure, development workflow, and deployment processes.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Repository structure and responsibilities</li>
            <li>How to set up the development environment</li>
            <li>How to contribute to each repository</li>
            <li>Release and versioning process</li>
            <li>CI/CD pipeline details</li>
            <li>Troubleshooting common issues</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">8.2 Create a Dependency Management Strategy</h3>
          <p className="mb-3">Document how to handle updates to the shared library across projects.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Version numbering scheme (Semantic Versioning)</li>
            <li>Process for updating dependencies</li>
            <li>Testing strategy for cross-repository changes</li>
            <li>Rollback procedures</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Final Considerations</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Benefits of This Approach</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Preserves git history for each component</li>
              <li>Enables independent versioning and deployment</li>
              <li>Improves team autonomy and focus</li>
              <li>Reduces build times and complexity</li>
              <li>Prepares for future expansion (MAUI app)</li>
              <li>Maintains shared code through a proper package</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Potential Challenges</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Coordinating cross-repository changes</li>
              <li>Managing versioning of the shared library</li>
              <li>Increased overhead in CI/CD setup</li>
              <li>Learning curve for developers used to monorepo</li>
              <li>Ensuring consistent environments across repos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoSplitGuide;
