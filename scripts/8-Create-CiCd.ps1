# 8. Create CI/CD
# This script creates CI/CD pipeline configurations

# Configuration
$SOLUTION_NAME = "PersonalityFramework"
$WORK_DIR = Join-Path $PWD "aspire-solution"
$LOG_FILE = Get-ChildItem -Path $WORK_DIR -Filter "aspire-setup-*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName

# Log function
function Write-Log {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $logMessage = "[$timestamp] $Message"
  Write-Host $logMessage
    
  # Only write to log file if it exists
  if (Test-Path $LOG_FILE) {
    Add-Content -Path $LOG_FILE -Value $logMessage
  }
}

# Error handling
function Handle-Error {
  param([string]$Message)
  Write-Log "ERROR: $Message"
  exit 1
}

# Create CI/CD pipeline configuration
function Create-CiCdPipelines {
  Write-Log "Creating CI/CD pipeline configuration..."
    
  # Change to workspace directory
  Set-Location $WORK_DIR
  if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
  # Create GitHub Actions workflow
  $githubWorkflowsDir = ".github/workflows"
  New-Item -ItemType Directory -Path $githubWorkflowsDir -Force | Out-Null
    
  $githubWorkflowContent = @"
name: Build and Deploy to Azure Arc

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
        dotnet-version: 8.0.x
        
    - name: Restore dependencies
      run: dotnet restore
      
    - name: Build
      run: dotnet build --no-restore --configuration Release
      
    - name: Test
      run: dotnet test --no-build --configuration Release
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Build Web frontend
      run: |
        cd ${SOLUTION_NAME}.Web
        npm ci
        npm run build
        
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: `${{ secrets.AZURE_CREDENTIALS }}
        
    - name: Build and push Docker images
      uses: azure/docker-login@v1
      with:
        login-server: `${{ secrets.ACR_LOGIN_SERVER }}
        username: `${{ secrets.ACR_USERNAME }}
        password: `${{ secrets.ACR_PASSWORD }}
        
    - name: Build and push API image
      run: |
        docker build -t `${{ secrets.ACR_LOGIN_SERVER }}/${SOLUTION_NAME.ToLower()}-api:latest -f ${SOLUTION_NAME}.Api/Dockerfile .
        docker push `${{ secrets.ACR_LOGIN_SERVER }}/${SOLUTION_NAME.ToLower()}-api:latest
        
    - name: Build and push Web image
      run: |
        docker build -t `${{ secrets.ACR_LOGIN_SERVER }}/${SOLUTION_NAME.ToLower()}-web:latest -f ${SOLUTION_NAME}.Web/Dockerfile ${SOLUTION_NAME}.Web
        docker push `${{ secrets.ACR_LOGIN_SERVER }}/${SOLUTION_NAME.ToLower()}-web:latest
        
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v1
      with:
        namespace: default
        manifests: |
          infra/k8s/api-deployment.yaml
          infra/k8s/api-service.yaml
          infra/k8s/web-deployment.yaml
          infra/k8s/web-service.yaml
          infra/k8s/ingress.yaml
        images: |
          `${{ secrets.ACR_LOGIN_SERVER }}/${SOLUTION_NAME.ToLower()}-api:latest
          `${{ secrets.ACR_LOGIN_SERVER }}/${SOLUTION_NAME.ToLower()}-web:latest
"@
  Set-Content -Path "$githubWorkflowsDir/build-deploy.yml" -Value $githubWorkflowContent
    
  # Create Azure DevOps pipeline
  $azurePipelinesContent = @"
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

variables:
  solution: '**/*.sln'
  buildPlatform: 'Any CPU'
  buildConfiguration: 'Release'
  acrLoginServer: '$(ACR_LOGIN_SERVER)'
  apiImageName: '${SOLUTION_NAME.ToLower()}-api'
  webImageName: '${SOLUTION_NAME.ToLower()}-web'

stages:
- stage: Build
  displayName: Build and push stage
  jobs:
  - job: Build
    displayName: Build
    steps:
    - task: DotNetCoreCLI@2
      displayName: 'Restore solution'
      inputs:
        command: 'restore'
        projects: '$(solution)'
        feedsToUse: 'select'

    - task: DotNetCoreCLI@2
      displayName: 'Build solution'
      inputs:
        command: 'build'
        projects: '$(solution)'
        arguments: '--configuration $(buildConfiguration)'

    - task: DotNetCoreCLI@2
      displayName: 'Run tests'
      inputs:
        command: 'test'
        projects: '**/*Tests/*.csproj'
        arguments: '--configuration $(buildConfiguration)'

    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
      displayName: 'Install Node.js'

    - script: |
        cd ${SOLUTION_NAME}.Web
        npm install
        npm run build
      displayName: 'Build Web frontend'

    - task: Docker@2
      displayName: 'Build and push API image'
      inputs:
        containerRegistry: 'ACRConnection'
        repository: '$(apiImageName)'
        command: 'buildAndPush'
        Dockerfile: '$(Build.SourcesDirectory)/${SOLUTION_NAME}.Api/Dockerfile'
        buildContext: '$(Build.SourcesDirectory)'
        tags: |
          $(Build.BuildId)
          latest

    - task: Docker@2
      displayName: 'Build and push Web image'
      inputs:
        containerRegistry: 'ACRConnection'
        repository: '$(webImageName)'
        command: 'buildAndPush'
        Dockerfile: '$(Build.SourcesDirectory)/${SOLUTION_NAME}.Web/Dockerfile'
        buildContext: '$(Build.SourcesDirectory)/${SOLUTION_NAME}.Web'
        tags: |
          $(Build.BuildId)
          latest

- stage: Deploy
  displayName: Deploy stage
  dependsOn: Build
  condition: succeeded()
  jobs:
  - job: Deploy
    displayName: Deploy
    steps:
    - task: KubernetesManifest@0
      displayName: Deploy API
      inputs:
        action: 'deploy'
        kubernetesServiceConnection: 'ArcK8sConnection'
        namespace: 'default'
        manifests: |
          $(Build.SourcesDirectory)/infra/k8s/api-deployment.yaml
          $(Build.SourcesDirectory)/infra/k8s/api-service.yaml
        containers: '$(acrLoginServer)/$(apiImageName):$(Build.BuildId)'

    - task: KubernetesManifest@0
      displayName: Deploy Web
      inputs:
        action: 'deploy'
        kubernetesServiceConnection: 'ArcK8sConnection'
        namespace: 'default'
        manifests: |
          $(Build.SourcesDirectory)/infra/k8s/web-deployment.yaml
          $(Build.SourcesDirectory)/infra/k8s/web-service.yaml
        containers: '$(acrLoginServer)/$(webImageName):$(Build.BuildId)'

    - task: KubernetesManifest@0
      displayName: Deploy Ingress
      inputs:
        action: 'deploy'
        kubernetesServiceConnection: 'ArcK8sConnection'
        namespace: 'default'
        manifests: |
          $(Build.SourcesDirectory)/infra/k8s/ingress.yaml
"@
  Set-Content -Path "azure-pipelines.yml" -Value $azurePipelinesContent
    
  Write-Log "CI/CD pipeline configuration created successfully."
}

# Main function
function Main {
  Write-Log "Starting CI/CD pipeline creation..."
    
  # Create CI/CD pipelines
  Create-CiCdPipelines
    
  Write-Log "CI/CD pipeline creation completed."
}

# Execute the script
Main