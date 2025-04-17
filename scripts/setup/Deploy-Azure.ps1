# Azure Deployment Script for PersonalityFramework
# This script deploys the solution to Azure

param(
[Parameter(Mandatory = $true)]
[string]$ResourceGroupName,

[Parameter(Mandatory = $false)]
[string]$Location = "eastus",

[Parameter(Mandatory = $true)]
[SecureString]$PostgresAdminPassword
)

# Check if Azure CLI is installed
try {
$azVersion = az --version
Write-Host "Azure CLI found."
}
catch {
Write-Host "ERROR: Azure CLI not found. Please install Azure CLI before running this script." -ForegroundColor Red
exit 1
}

# Check if logged in to Azure
$loginStatus = az account show --query "name" -o tsv 2>$null
if (-not $loginStatus) {
Write-Host "You are not logged in to Azure. Please login..."
az login
if (-not $?) {
  Write-Host "ERROR: Failed to login to Azure." -ForegroundColor Red
  exit 1
}
}

# Create resource group if it doesn't exist
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
Write-Host "Creating resource group '$ResourceGroupName'..."
az group create --name $ResourceGroupName --location $Location
if (-not $?) {
  Write-Host "ERROR: Failed to create resource group." -ForegroundColor Red
  exit 1
}
}

# Convert secure string to plain text for parameter file
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($PostgresAdminPassword)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Update parameters file with password
$parametersFile = Join-Path $PSScriptRoot "..\infra\bicep\parameters.json"
$parameters = Get-Content $parametersFile | ConvertFrom-Json
$parameters.parameters.postgresAdminPassword.value = $PlainPassword
$parameters | ConvertTo-Json -Depth 10 | Set-Content $parametersFile

# Deploy Bicep template
Write-Host "Deploying Azure resources..."
$bicepFile = Join-Path $PSScriptRoot "..\infra\bicep\main.bicep"
az deployment group create --resource-group $ResourceGroupName --template-file $bicepFile --parameters @$parametersFile
if (-not $?) {
Write-Host "ERROR: Failed to deploy Azure resources." -ForegroundColor Red
exit 1
}

# Clear password from parameters file
$parameters.parameters.postgresAdminPassword.value = ""
$parameters | ConvertTo-Json -Depth 10 | Set-Content $parametersFile

# Get deployment outputs
$outputs = az deployment group show --resource-group $ResourceGroupName --name main --query properties.outputs
$apiUrl = ($outputs | ConvertFrom-Json).apiUrl.value
$webUrl = ($outputs | ConvertFrom-Json).webUrl.value
$acrLoginServer = ($outputs | ConvertFrom-Json).containerRegistryLoginServer.value

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "API URL: $apiUrl" -ForegroundColor Cyan
Write-Host "Web URL: $webUrl" -ForegroundColor Cyan
Write-Host "Container Registry: $acrLoginServer" -ForegroundColor Cyan

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Build and push your Docker images to the container registry:" -ForegroundColor Yellow
Write-Host "   az acr login --name $($acrLoginServer.Split('.')[0])" -ForegroundColor Yellow
Write-Host "   docker build -t $acrLoginServer/personalityframework-api:latest -f PersonalityFramework.Api/Dockerfile ." -ForegroundColor Yellow
Write-Host "   docker push $acrLoginServer/personalityframework-api:latest" -ForegroundColor Yellow
Write-Host "   docker build -t $acrLoginServer/personalityframework-web:latest -f PersonalityFramework.Web/Dockerfile ." -ForegroundColor Yellow
Write-Host "   docker push $acrLoginServer/personalityframework-web:latest" -ForegroundColor Yellow
Write-Host "2. Restart the web apps to pull the latest images:" -ForegroundColor Yellow
Write-Host "   az webapp restart --name personalityframework-api --resource-group $ResourceGroupName" -ForegroundColor Yellow
Write-Host "   az webapp restart --name personalityframework-web --resource-group $ResourceGroupName" -ForegroundColor Yellow
