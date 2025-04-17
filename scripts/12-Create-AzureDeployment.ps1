# 12. Create Azure Deployment Scripts
# This script creates Azure deployment scripts for the solution

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

# Create Azure deployment scripts
function Create-AzureDeployment {
  Write-Log "Creating Azure deployment scripts..."
    
  # Change to workspace directory
  Set-Location $WORK_DIR
  if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
  # Create infra/bicep directory if it doesn't exist
  $bicepDir = "infra/bicep"
  if (-not (Test-Path $bicepDir)) {
    New-Item -ItemType Directory -Path $bicepDir -Force | Out-Null
  }
    
  # Create main.bicep file
  $mainBicepContent = @"
@description('The name of the solution')
param solutionName string = '${SOLUTION_NAME.ToLower()}'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The SKU of App Service Plan')
param appServicePlanSku string = 'P1v2'

@description('The name of the container registry')
param containerRegistryName string = '\${solutionName}registry'

@description('The admin username for PostgreSQL')
param postgresAdminUsername string = 'postgres'

@description('The admin password for PostgreSQL')
@secure()
param postgresAdminPassword string

// Resource names
var appServicePlanName = '\${solutionName}-plan'
var apiAppName = '\${solutionName}-api'
var webAppName = '\${solutionName}-web'
var postgresServerName = '\${solutionName}-db'
var postgresDbName = '\${solutionName}db'
var logAnalyticsName = '\${solutionName}-logs'
var appInsightsName = '\${solutionName}-insights'

// Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2021-06-01-preview' = {
  name: containerRegistryName
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    adminUserEnabled: true
  }
}

// Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: appServicePlanSku
  }
  properties: {
    reserved: true
  }
}

// API App Service
resource apiApp 'Microsoft.Web/sites@2021-02-01' = {
  name: apiAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|\${containerRegistry.name}.azurecr.io/\${solutionName}-api:latest'
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://\${containerRegistry.name}.azurecr.io'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: containerRegistry.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: containerRegistry.listCredentials().passwords[0].value
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: 'Host=\${postgresServer.name}.postgres.database.azure.com;Database=\${postgresDbName};Username=\${postgresAdminUsername};Password=\${postgresAdminPassword}'
        }
      ]
    }
  }
}

// Web App Service
resource webApp 'Microsoft.Web/sites@2021-02-01' = {
  name: webAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|\${containerRegistry.name}.azurecr.io/\${solutionName}-web:latest'
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://\${containerRegistry.name}.azurecr.io'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: containerRegistry.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: containerRegistry.listCredentials().passwords[0].value
        }
        {
          name: 'API_URL'
          value: 'https://\${apiApp.name}.azurewebsites.net'
        }
      ]
    }
  }
}

// PostgreSQL Server
resource postgresServer 'Microsoft.DBforPostgreSQL/servers@2017-12-01' = {
  name: postgresServerName
  location: location
  properties: {
    administratorLogin: postgresAdminUsername
    administratorLoginPassword: postgresAdminPassword
    version: '13'
    sslEnforcement: 'Enabled'
    minimalTlsVersion: 'TLS1_2'
    createMode: 'Default'
    storageProfile: {
      storageMB: 32768
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
  }
}

// PostgreSQL Database
resource postgresDb 'Microsoft.DBforPostgreSQL/servers/databases@2017-12-01' = {
  name: postgresDbName
  parent: postgresServer
  properties: {
    charset: 'utf8'
    collation: 'en_US.utf8'
  }
}

// PostgreSQL Firewall Rule for Azure Services
resource postgresFirewallRule 'Microsoft.DBforPostgreSQL/servers/firewallRules@2017-12-01' = {
  name: 'AllowAzureServices'
  parent: postgresServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Outputs
output apiUrl string = 'https://\${apiApp.properties.defaultHostName}'
output webUrl string = 'https://\${webApp.properties.defaultHostName}'
output containerRegistryLoginServer string = containerRegistry.properties.loginServer
"@
  Set-Content -Path "$bicepDir/main.bicep" -Value $mainBicepContent
  
  # Create parameters file
  $parametersBicepContent = @"
{
  "\$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "solutionName": {
      "value": "${SOLUTION_NAME.ToLower()}"
    },
    "location": {
      "value": "eastus"
    },
    "appServicePlanSku": {
      "value": "P1v2"
    },
    "containerRegistryName": {
      "value": "${SOLUTION_NAME.ToLower()}registry"
    },
    "postgresAdminUsername": {
      "value": "postgres"
    },
    "postgresAdminPassword": {
      "value": ""
    }
  }
}
"@
  Set-Content -Path "$bicepDir/parameters.json" -Value $parametersBicepContent
  
  # Create deployment script
  $scriptsDir = "scripts"
  if (-not (Test-Path $scriptsDir)) {
    New-Item -ItemType Directory -Path $scriptsDir -Force | Out-Null
  }
  
  $deployAzureScriptContent = @"
# Azure Deployment Script for $SOLUTION_NAME
# This script deploys the solution to Azure

param(
  [Parameter(Mandatory = \$true)]
  [string]\$ResourceGroupName,
  
  [Parameter(Mandatory = \$false)]
  [string]\$Location = "eastus",
  
  [Parameter(Mandatory = \$true)]
  [SecureString]\$PostgresAdminPassword
)

# Check if Azure CLI is installed
try {
  \$azVersion = az --version
  Write-Host "Azure CLI found."
}
catch {
  Write-Host "ERROR: Azure CLI not found. Please install Azure CLI before running this script." -ForegroundColor Red
  exit 1
}

# Check if logged in to Azure
\$loginStatus = az account show --query "name" -o tsv 2>null
if (-not \$loginStatus) {
  Write-Host "You are not logged in to Azure. Please login..."
  az login
  if (-not \$?) {
    Write-Host "ERROR: Failed to login to Azure." -ForegroundColor Red
    exit 1
  }
}

# Create resource group if it doesn't exist
\$rgExists = az group exists --name \$ResourceGroupName
if (\$rgExists -eq "false") {
  Write-Host "Creating resource group '\$ResourceGroupName'..."
  az group create --name \$ResourceGroupName --location \$Location
  if (-not \$?) {
    Write-Host "ERROR: Failed to create resource group." -ForegroundColor Red
    exit 1
  }
}

# Convert secure string to plain text for parameter file
\$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR(\$PostgresAdminPassword)
\$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(\$BSTR)

# Update parameters file with password
\$parametersFile = Join-Path \$PSScriptRoot "..\infra\bicep\parameters.json"
\$parameters = Get-Content \$parametersFile | ConvertFrom-Json
\$parameters.parameters.postgresAdminPassword.value = \$PlainPassword
\$parameters | ConvertTo-Json -Depth 10 | Set-Content \$parametersFile

# Deploy Bicep template
Write-Host "Deploying Azure resources..."
\$bicepFile = Join-Path \$PSScriptRoot "..\infra\bicep\main.bicep"
az deployment group create --resource-group \$ResourceGroupName --template-file \$bicepFile --parameters @\$parametersFile
if (-not \$?) {
  Write-Host "ERROR: Failed to deploy Azure resources." -ForegroundColor Red
  exit 1
}

# Clear password from parameters file
\$parameters.parameters.postgresAdminPassword.value = ""
\$parameters | ConvertTo-Json -Depth 10 | Set-Content \$parametersFile

# Get deployment outputs
\$outputs = az deployment group show --resource-group \$ResourceGroupName --name main --query properties.outputs
\$apiUrl = \$outputs.apiUrl.value
\$webUrl = \$outputs.webUrl.value
\$acrLoginServer = \$outputs.containerRegistryLoginServer.value

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "API URL: \$apiUrl" -ForegroundColor Cyan
Write-Host "Web URL: \$webUrl" -ForegroundColor Cyan
Write-Host "Container Registry: \$acrLoginServer" -ForegroundColor Cyan

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Build and push your Docker images to the container registry:" -ForegroundColor Yellow
Write-Host "   az acr login --name \$(\$acrLoginServer.Split('.')[0])" -ForegroundColor Yellow
Write-Host "   docker build -t \$acrLoginServer/${SOLUTION_NAME.ToLower()}-api:latest -f ${SOLUTION_NAME}.Api/Dockerfile ." -ForegroundColor Yellow
Write-Host "   docker push \$acrLoginServer/${SOLUTION_NAME.ToLower()}-api:latest" -ForegroundColor Yellow
Write-Host "   docker build -t \$acrLoginServer/${SOLUTION_NAME.ToLower()}-web:latest -f ${SOLUTION_NAME}.Web/Dockerfile ${SOLUTION_NAME}.Web" -ForegroundColor Yellow
Write-Host "   docker push \$acrLoginServer/${SOLUTION_NAME.ToLower()}-web:latest" -ForegroundColor Yellow
Write-Host "2. Restart the web apps to pull the latest images:" -ForegroundColor Yellow
Write-Host "   az webapp restart --name ${SOLUTION_NAME.ToLower()}-api --resource-group \$ResourceGroupName" -ForegroundColor Yellow
Write-Host "   az webapp restart --name ${SOLUTION_NAME.ToLower()}-web --resource-group \$ResourceGroupName" -ForegroundColor Yellow
"@
  Set-Content -Path "$scriptsDir/Deploy-Azure.ps1" -Value $deployAzureScriptContent
  
  # Create Bash version of the deployment script
  $deployAzureShScriptContent = @"
#!/bin/bash
# Azure Deployment Script for $SOLUTION_NAME
# This script deploys the solution to Azure

# Check if parameters are provided
if [ \$# -lt 2 ]; then
  echo "Usage: ./deploy-azure.sh <resource-group-name> <postgres-admin-password> [location]"
  echo "Example: ./deploy-azure.sh ${SOLUTION_NAME.ToLower()}-rg 'MySecurePassword123!' eastus"
  exit 1
fi

RESOURCE_GROUP_NAME=\$1
POSTGRES_ADMIN_PASSWORD=\$2
LOCATION=\${3:-"eastus"}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
  echo "ERROR: Azure CLI not found. Please install Azure CLI before running this script."
  exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
  echo "You are not logged in to Azure. Please login..."
  az login
  if [ \$? -ne 0 ]; then
    echo "ERROR: Failed to login to Azure."
    exit 1
  fi
fi

# Create resource group if it doesn't exist
if [ "\$(az group exists --name \$RESOURCE_GROUP_NAME)" = "false" ]; then
  echo "Creating resource group '\$RESOURCE_GROUP_NAME'..."
  az group create --name \$RESOURCE_GROUP_NAME --location \$LOCATION
  if [ \$? -ne 0 ]; then
    echo "ERROR: Failed to create resource group."
    exit 1
  fi
fi

# Update parameters file with password
PARAMETERS_FILE="\$(dirname "\$0")/../infra/bicep/parameters.json"
TEMP_FILE="\$(mktemp)"

# Use jq to update the password if available, otherwise use sed
if command -v jq &> /dev/null; then
  jq ".parameters.postgresAdminPassword.value = \"\$POSTGRES_ADMIN_PASSWORD\"" \$PARAMETERS_FILE > \$TEMP_FILE
  mv \$TEMP_FILE \$PARAMETERS_FILE
else
  # Fallback to sed if jq is not available
  sed -i "s/\"postgresAdminPassword\": {\\n.*\"value\": \".*\"/\"postgresAdminPassword\": {\\n      \"value\": \"\$POSTGRES_ADMIN_PASSWORD\"/" \$PARAMETERS_FILE
fi

# Deploy Bicep template
echo "Deploying Azure resources..."
BICEP_FILE="\$(dirname "\$0")/../infra/bicep/main.bicep"
az deployment group create --resource-group \$RESOURCE_GROUP_NAME --template-file \$BICEP_FILE --parameters @\$PARAMETERS_FILE
if [ \$? -ne 0 ]; then
  echo "ERROR: Failed to deploy Azure resources."
  
  # Clear password from parameters file
  if command -v jq &> /dev/null; then
    jq ".parameters.postgresAdminPassword.value = \"\"" \$PARAMETERS_FILE > \$TEMP_FILE
    mv \$TEMP_FILE \$PARAMETERS_FILE
  else
    sed -i "s/\"postgresAdminPassword\": {\\n.*\"value\": \".*\"/\"postgresAdminPassword\": {\\n      \"value\": \"\"/" \$PARAMETERS_FILE
  fi
  
  exit 1
fi

# Clear password from parameters file
if command -v jq &> /dev/null; then
  jq ".parameters.postgresAdminPassword.value = \"\"" \$PARAMETERS_FILE > \$TEMP_FILE
  mv \$TEMP_FILE \$PARAMETERS_FILE
else
  sed -i "s/\"postgresAdminPassword\": {\\n.*\"value\": \".*\"/\"postgresAdminPassword\": {\\n      \"value\": \"\"/" \$PARAMETERS_FILE
fi

# Get deployment outputs
API_URL=\$(az deployment group show --resource-group \$RESOURCE_GROUP_NAME --name main --query properties.outputs.apiUrl.value -o tsv)
WEB_URL=\$(az deployment group show --resource-group \$RESOURCE_GROUP_NAME --name main --query properties.outputs.webUrl.value -o tsv)
ACR_LOGIN_SERVER=\$(az deployment group show --resource-group \$RESOURCE_GROUP_NAME --name main --query properties.outputs.containerRegistryLoginServer.value -o tsv)

echo "Deployment completed successfully!"
echo "API URL: \$API_URL"
echo "Web URL: \$WEB_URL"
echo "Container Registry: \$ACR_LOGIN_SERVER"

echo ""
echo "Next steps:"
echo "1. Build and push your Docker images to the container registry:"
echo "   az acr login --name \$(echo \$ACR_LOGIN_SERVER | cut -d'.' -f1)"
echo "   docker build -t \$ACR_LOGIN_SERVER/${SOLUTION_NAME.ToLower()}-api:latest -f ${SOLUTION_NAME}.Api/Dockerfile ."
echo "   docker push \$ACR_LOGIN_SERVER/${SOLUTION_NAME.ToLower()}-api:latest"
echo "   docker build -t \$ACR_LOGIN_SERVER/${SOLUTION_NAME.ToLower()}-web:latest -f ${SOLUTION_NAME}.Web/Dockerfile ${SOLUTION_NAME}.Web"
echo "   docker push \$ACR_LOGIN_SERVER/${SOLUTION_NAME.ToLower()}-web:latest"
echo "2. Restart the web apps to pull the latest images:"
echo "   az webapp restart --name ${SOLUTION_NAME.ToLower()}-api --resource-group \$RESOURCE_GROUP_NAME"
echo "   az webapp restart --name ${SOLUTION_NAME.ToLower()}-web --resource-group \$RESOURCE_GROUP_NAME"
"@
  Set-Content -Path "$scriptsDir/deploy-azure.sh" -Value $deployAzureShScriptContent
  
  # Make bash script executable
  if ($IsLinux -or $IsMacOS) {
    chmod +x "$scriptsDir/deploy-azure.sh"
  }
  
  Write-Log "Azure deployment scripts created successfully."
}

# Main function
function Main {
  Write-Log "Starting Azure deployment script creation..."
    
  # Create Azure deployment scripts
  Create-AzureDeployment
    
  Write-Log "Azure deployment script creation completed."
}

# Execute the script
Main