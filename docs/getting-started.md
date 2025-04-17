# Getting Started

## Prerequisites

- .NET 9 SDK or later
- Docker Desktop
- Visual Studio 2022 or later (optional)
- VS Code (optional)

## Setup Development Environment

1. Clone the repository:
  `ash
  git clone <repository-url>
  cd PersonalityFramework
  `

2. Restore dependencies:
  `ash
  dotnet restore
  `

3. Run the application:
  `ash
  dotnet run --project PersonalityFramework.AppHost
  `

4. Open the Aspire dashboard at http://localhost:18888

## Project Structure

- **PersonalityFramework.AppHost** - The orchestrator project
- **PersonalityFramework.ServiceDefaults** - Shared service configuration
- **PersonalityFramework.Api** - API service
- **PersonalityFramework.Web** - Web frontend

## Development Workflow

1. Make changes to the code
2. Run the application using dotnet run --project PersonalityFramework.AppHost
3. Test your changes
4. Commit and push your changes

## Debugging

### Using Visual Studio
1. Open the solution file in Visual Studio
2. Set the AppHost project as the startup project
3. Press F5 to start debugging

### Using VS Code
1. Open the project folder in VS Code
2. Install the C# extension
3. Open the debug view and select ".NET Core Launch (web)" configuration
4. Press F5 to start debugging

