# Azure Arc deployment script for PersonalityFramework

# Variables
$RESOURCE_GROUP = "PersonalityFrameworkResourceGroup"
$LOCATION = "eastus"
$CLUSTER_NAME = "-cluster"

# Create resource group
Write-Host "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Register the Azure Arc providers
Write-Host "Registering Azure Arc providers..."
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation

# Connect your Kubernetes cluster to Azure Arc
# Note: You need to be logged in to your cluster with kubectl before running this
Write-Host "Connecting Kubernetes cluster to Azure Arc..."
az connectedk8s connect --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP

# Deploy the application to the Arc-connected cluster
Write-Host "Deploying application to Arc-connected cluster..."
kubectl apply -f ../k8s/api-deployment.yaml
kubectl apply -f ../k8s/api-service.yaml
kubectl apply -f ../k8s/web-deployment.yaml
kubectl apply -f ../k8s/web-service.yaml
kubectl apply -f ../k8s/ingress.yaml

Write-Host "Deployment to Azure Arc completed."
  az login
  if (-not $?) {
    Write-Host "ERROR: Failed to login to Azure." -ForegroundColor Red
    exit 1
  }
}

# Check if Arc extension is installed
$arcExtension = az extension show --name connectedk8s --query name -o tsv 2>$null
if (-not $arcExtension) {
  Write-Host "Installing Azure Arc extension for Azure CLI..."
  az extension add --name connectedk8s
  if (-not $?) {
    Write-Host "ERROR: Failed to install Azure Arc extension." -ForegroundColor Red
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

# Check if cluster is already connected to Arc
$clusterExists = az connectedk8s show --name $ClusterName --resource-group $ResourceGroupName 2>$null
if (-not $clusterExists) {
  Write-Host "Connecting Kubernetes cluster to Azure Arc..."
  az connectedk8s connect --name $ClusterName --resource-group $ResourceGroupName
  if (-not $?) {
    Write-Host "ERROR: Failed to connect Kubernetes cluster to Azure Arc." -ForegroundColor Red
    exit 1
  }
}

# Create namespace if it doesn't exist
Write-Host "Creating Kubernetes namespace '$Namespace' if it doesn't exist..."
kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f -

# Deploy application manifests
Write-Host "Deploying application to Arc-enabled Kubernetes cluster..."
$manifestsPath = Join-Path $PSScriptRoot "..\config\k8s"
if (Test-Path $manifestsPath) {
  kubectl apply -f $manifestsPath --namespace $Namespace
  if (-not $?) {
    Write-Host "ERROR: Failed to deploy application manifests." -ForegroundColor Red
    exit 1
  }
}
else {
  Write-Host "WARNING: Manifests directory not found at $manifestsPath" -ForegroundColor Yellow
}

# Enable monitoring
Write-Host "Enabling Azure Monitor for Arc-enabled Kubernetes..."
az k8s-extension create `
  --name azuremonitor-containers `
  --cluster-name $ClusterName `
  --resource-group $ResourceGroupName `
  --cluster-type connectedClusters `
  --extension-type Microsoft.AzureMonitor.Containers

Write-Host "Deployment to Azure Arc completed successfully!" -ForegroundColor Green
Write-Host "You can now manage your application through Azure Arc in the Azure Portal." -ForegroundColor Cyan