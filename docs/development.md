# Development Guide

## Development Environment Setup

### Prerequisites

- .NET 9 SDK
- Docker Desktop
- Git
- Visual Studio 2022 or VS Code

### Local Setup

1. Clone the repository
2. Install the .NET Aspire workload:
  `ash
  dotnet workload install aspire
  `
3. Restore dependencies:
  `ash
  dotnet restore
  `

## Project Structure

- **PersonalityFramework.AppHost**: Orchestrator project
- **PersonalityFramework.ServiceDefaults**: Shared service configuration
- **PersonalityFramework.Api**: API service
- **PersonalityFramework.Web**: Web frontend
- **docs**: Documentation
- **infra**: Infrastructure as code
- **tests**: Test projects

## Development Workflow

### Running the Application

`ash
dotnet run --project PersonalityFramework.AppHost
`

This will start all services and open the Aspire dashboard.

### Adding a New Service

1. Create a new project:
  `ash
  dotnet new webapi -n PersonalityFramework.NewService
  `

2. Add it to the solution:
  `ash
  dotnet sln add PersonalityFramework.NewService
  `

3. Add reference to ServiceDefaults:
  `ash
  cd PersonalityFramework.NewService
  dotnet add reference ../PersonalityFramework.ServiceDefaults
  `

4. Update the AppHost to include the new service

### Testing

Run tests:
`ash
dotnet test
`

### Code Style and Standards

- Follow Microsoft's C# coding conventions
- Use async/await for asynchronous operations
- Add XML documentation comments for public APIs
- Write unit tests for new functionality

## Branching Strategy

- main: Production-ready code
- develop: Integration branch for features
- eature/*: Feature branches
- ugfix/*: Bug fix branches
- elease/*: Release preparation branches

## Pull Request Process

1. Create a feature branch
2. Implement changes
3. Run tests locally
4. Submit a pull request to the develop branch
5. Ensure CI pipeline passes
6. Request code review
7. Address feedback
8. Merge when approved

## Versioning

We use Semantic Versioning (SemVer):

- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backwards compatible manner
- PATCH version for backwards compatible bug fixes

## Troubleshooting

### Common Issues

1. **Service discovery issues**:
  - Check that all services are running
  - Verify network configuration

2. **Database connection issues**:
  - Verify connection strings
  - Check database server is running

3. **Docker issues**:
  - Ensure Docker Desktop is running
  - Check container logs

