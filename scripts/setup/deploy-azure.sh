#!/bin/bash
# Azure Deployment Script for PersonalityFramework
# This script deploys the solution to Azure

# Check if parameters are provided
if [ $# -lt 2 ]; then
echo "Usage: ./deploy-azure.sh <resource-group-name> <postgres-admin-password> [location]"
echo "Example: ./deploy-azure.sh personalityframework-rg 'MySecurePassword123!' eastus"
exit 1
fi

RESOURCE_GROUP_NAME=$1
POSTGRES_ADMIN_PASSWORD=$2
LOCATION=${3:-"eastus"}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
echo "ERROR: Azure CLI not found. Please install Azure CLI before running this script."
exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
echo "You are not logged in to Azure. Please login..."
az login
if [ $? -ne 0 ]; then
  echo "ERROR: Failed to login to Azure."
  exit 1
fi
fi

# Create resource group if it doesn't exist
if [ "$(az group exists --name $RESOURCE_GROUP_NAME)" = "false" ]; then
echo "Creating resource group '$RESOURCE_GROUP_NAME'..."
az group create --name $RESOURCE_GROUP_NAME --location $LOCATION
if [ $? -ne 0 ]; then
  echo "ERROR: Failed to create resource group."
  exit 1
fi
fi

# Get script directory
SCRIPT_DIR=$(dirname "$0")
PARAMETERS_FILE="$SCRIPT_DIR/../infra/bicep/parameters.json"
BICEP_FILE="$SCRIPT_DIR/../infra/bicep/main.bicep"

# Create temp file
TEMP_FILE=$(mktemp)

# Update parameters file with password
if command -v jq &> /dev/null; then
jq ".parameters.postgresAdminPassword.value = \"$POSTGRES_ADMIN_PASSWORD\"" $PARAMETERS_FILE > $TEMP_FILE
mv $TEMP_FILE $PARAMETERS_FILE
else
# Fallback to sed if jq is not available
sed -i "s/\"postgresAdminPassword\": {\\n.*\"value\": \".*\"/\"postgresAdminPassword\": {\\n      \"value\": \"$POSTGRES_ADMIN_PASSWORD\"/" $PARAMETERS_FILE
fi

# Deploy Bicep template
echo "Deploying Azure resources..."
az deployment group create --resource-group $RESOURCE_GROUP_NAME --template-file $BICEP_FILE --parameters @$PARAMETERS_FILE
if [ $? -ne 0 ]; then
echo "ERROR: Failed to deploy Azure resources."

# Clear password from parameters file
if command -v jq &> /dev/null; then
  jq ".parameters.postgresAdminPassword.value = \"\"" $PARAMETERS_FILE > $TEMP_FILE
  mv $TEMP_FILE $PARAMETERS_FILE
else
  sed -i "s/\"postgresAdminPassword\": {\\n.*\"value\": \".*\"/\"postgresAdminPassword\": {\\n      \"value\": \"\"/" $PARAMETERS_FILE
fi

exit 1
fi

# Clear password from parameters file
if command -v jq &> /dev/null; then
jq ".parameters.postgresAdminPassword.value = \"\"" $PARAMETERS_FILE > $TEMP_FILE
mv $TEMP_FILE $PARAMETERS_FILE
else
sed -i "s/\"postgresAdminPassword\": {\\n.*\"value\": \".*\"/\"postgresAdminPassword\": {\\n      \"value\": \"\"/" $PARAMETERS_FILE
fi

# Get deployment outputs
OUTPUTS=$(az deployment group show --resource-group $RESOURCE_GROUP_NAME --name main --query properties.outputs)
API_URL=$(echo $OUTPUTS | jq -r .apiUrl.value)
WEB_URL=$(echo $OUTPUTS | jq -r .webUrl.value)
ACR_LOGIN_SERVER=$(echo $OUTPUTS | jq -r .containerRegistryLoginServer.value)

echo "Deployment completed successfully!"
echo "API URL: $API_URL"
echo "Web URL: $WEB_URL"
echo "Container Registry: $ACR_LOGIN_SERVER"

echo ""
echo "Next steps:"
echo "1. Build and push your Docker images to the container registry:"
echo "   az acr login --name $(echo $ACR_LOGIN_SERVER | cut -d'.' -f1)"
echo "   docker build -t $ACR_LOGIN_SERVER/personalityframework-api:latest -f PersonalityFramework.Api/Dockerfile ."
echo "   docker push $ACR_LOGIN_SERVER/personalityframework-api:latest"
echo "   docker build -t $ACR_LOGIN_SERVER/personalityframework-web:latest -f PersonalityFramework.Web/Dockerfile ."
echo "   docker push $ACR_LOGIN_SERVER/personalityframework-web:latest"
echo "2. Restart the web apps to pull the latest images:"
echo "   az webapp restart --name personalityframework-api --resource-group $RESOURCE_GROUP_NAME"
echo "   az webapp restart --name personalityframework-web --resource-group $RESOURCE_GROUP_NAME"
