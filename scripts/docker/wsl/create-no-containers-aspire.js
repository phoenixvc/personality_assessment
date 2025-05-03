#!/usr/bin/env node

const { colors } = require('./utils');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Creating No-Containers Aspire Project${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to create a no-containers version of the Aspire project
async function createNoContainersAspire() {
  console.log(`${colors.yellow}Creating a no-containers version of your Aspire project...${colors.reset}`);
  
  try {
    // Find the Aspire project directory
    const aspireDir = path.join(process.cwd(), 'aspire', 'PersonalityFramework.AppHost');
    
    if (!fs.existsSync(aspireDir)) {
      console.log(`${colors.yellow}Could not find Aspire project directory at ${aspireDir}${colors.reset}`);
      console.log(`${colors.yellow}Please run this script from the root of your project.${colors.reset}`);
      return false;
    }
    
    // Create NoContainers directory
    const noContainersDir = path.join(aspireDir, 'NoContainers');
    if (!fs.existsSync(noContainersDir)) {
      fs.mkdirSync(noContainersDir, { recursive: true });
    }
    
    // Create project file
    const csprojContent = `<Project Sdk="Microsoft.NET.Sdk">

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
`;
    
    fs.writeFileSync(path.join(noContainersDir, 'PersonalityFramework.AppHost.NoContainers.csproj'), csprojContent);
    
    // Create Program.cs
    const programContent = `using Aspire.Hosting;

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
`;
    
    fs.writeFileSync(path.join(noContainersDir, 'Program.cs'), programContent);
    
    // Create Properties directory and launchSettings.json
    const propertiesDir = path.join(noContainersDir, 'Properties');
    if (!fs.existsSync(propertiesDir)) {
      fs.mkdirSync(propertiesDir, { recursive: true });
    }
    
    const launchSettingsContent = `{
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
}`;
    
    fs.writeFileSync(path.join(propertiesDir, 'launchSettings.json'), launchSettingsContent);
    
    // Update package.json
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (!packageJson.scripts) {
          packageJson.scripts = {};
        }
        
        packageJson.scripts['start:aspire:no-containers'] = 'dotnet run --project aspire/PersonalityFramework.AppHost/NoContainers/PersonalityFramework.AppHost.NoContainers.csproj';
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(`${colors.green}Added 'start:aspire:no-containers' script to package.json${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.yellow}Could not update package.json: ${error.message}${colors.reset}`);
    }
    
    // Create a README file with instructions
    const readmeContent = `# Running Aspire Without Containers

This project allows you to run the Aspire application without using Docker containers.

## Prerequisites

1. Install MongoDB locally:
   - Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register

2. Update the connection string in \`Program.cs\` if needed.

## Running the Application

Run the application using:

\`\`\`
npm run start:aspire:no-containers
\`\`\`

Or directly with .NET:

\`\`\`
dotnet run --project aspire/PersonalityFramework.AppHost/NoContainers/PersonalityFramework.AppHost.NoContainers.csproj
\`\`\`

## Troubleshooting

- Ensure MongoDB is running locally on port 27017
- If using MongoDB Atlas, update the connection string with your credentials
`;
    
    fs.writeFileSync(path.join(noContainersDir, 'README.md'), readmeContent);
    
    console.log(`${colors.green}No-containers Aspire project created successfully.${colors.reset}`);
    console.log(`${colors.yellow}You can now run your Aspire application without Docker using:${colors.reset}`);
    console.log(`${colors.cyan}npm run start:aspire:no-containers${colors.reset}`);
    console.log();
    console.log(`${colors.yellow}Note: You'll need to have MongoDB installed locally or use a cloud MongoDB instance.${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error creating no-containers Aspire project: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run the function and exit
createNoContainersAspire()
  .then(() => {
    console.log(`${colors.green}No-containers Aspire project creation completed.${colors.reset}`);
  })
  .catch((error) => {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  });