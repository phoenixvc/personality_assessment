# 7. Create Infrastructure
# This script creates the infrastructure components for Azure Arc deployment

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

# Create infrastructure for Azure Arc
function Create-Infrastructure {
  Write-Log "Creating infrastructure components..."
    
  # Change to workspace directory
  Set-Location $WORK_DIR
  if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
  # Create infra directory
  New-Item -ItemType Directory -Path "infra/arc", "infra/k8s", "infra/bicep" -Force | Out-Null
    
  # Create Kubernetes manifests
  $apiDeploymentContent = @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${SOLUTION_NAME.ToLower()}-api
  labels:
    app: ${SOLUTION_NAME.ToLower()}-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${SOLUTION_NAME.ToLower()}-api
  template:
    metadata:
      labels:
        app: ${SOLUTION_NAME.ToLower()}-api
    spec:
      containers:
      - name: api
        image: ${SOLUTION_NAME.ToLower()}-api:latest
        ports:
        - containerPort: 80
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
"@
  Set-Content -Path "infra/k8s/api-deployment.yaml" -Value $apiDeploymentContent
    
  $apiServiceContent = @"
apiVersion: v1
kind: Service
metadata:
  name: ${SOLUTION_NAME.ToLower()}-api
spec:
  selector:
    app: ${SOLUTION_NAME.ToLower()}-api
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
"@
  Set-Content -Path "infra/k8s/api-service.yaml" -Value $apiServiceContent
    
  $webDeploymentContent = @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${SOLUTION_NAME.ToLower()}-web
  labels:
    app: ${SOLUTION_NAME.ToLower()}-web
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${SOLUTION_NAME.ToLower()}-web
  template:
    metadata:
      labels:
        app: ${SOLUTION_NAME.ToLower()}-web
    spec:
      containers:
      - name: web
        image: ${SOLUTION_NAME.ToLower()}-web:latest
        ports:
        - containerPort: 80
"@
  Set-Content -Path "infra/k8s/web-deployment.yaml" -Value $webDeploymentContent
    
  $webServiceContent = @"
apiVersion: v1
kind: Service
metadata:
  name: ${SOLUTION_NAME.ToLower()}-web
spec:
  selector:
    app: ${SOLUTION_NAME.ToLower()}-web
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
"@
  Set-Content -Path "infra/k8s/web-service.yaml" -Value $webServiceContent
    
  $ingressContent = @"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${SOLUTION_NAME.ToLower()}-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: ${SOLUTION_NAME.ToLower()}-api
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${SOLUTION_NAME.ToLower()}-web
            port:
              number: 80
"@
  Set-Content -Path "infra/k8s/ingress.yaml" -Value $ingressContent
    
  # Create Arc deployment script
  $arcDeployPsContent = @"
# Azure Arc deployment script for ${SOLUTION_NAME}

# Variables
`$RESOURCE_GROUP="${SOLUTION_NAME}ResourceGroup"
`$LOCATION="eastus"
`$CLUSTER_NAME="${SOLUTION_NAME.ToLower()}-cluster"

# Create resource group
Write-Host "Creating resource group..."
az group create --name `$RESOURCE_GROUP --location `$LOCATION

# Register the Azure Arc providers
Write-Host "Registering Azure Arc providers..."
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation

# Connect your Kubernetes cluster to Azure Arc
# Note: You need to be logged in to your cluster with kubectl before running this
Write-Host "Connecting Kubernetes cluster to Azure Arc..."
az connectedk8s connect --name `$CLUSTER_NAME --resource-group `$RESOURCE_GROUP

# Deploy the application to the Arc-connected cluster
Write-Host "Deploying application to Arc-connected cluster..."
kubectl apply -f ../k8s/api-deployment.yaml
kubectl apply -f ../k8s/api-service.yaml
kubectl apply -f ../k8s/web-deployment.yaml
kubectl apply -f ../k8s/web-service.yaml
kubectl apply -f ../k8s/ingress.yaml

Write-Host "Deployment to Azure Arc completed."
"@
  Set-Content -Path "infra/arc/Deploy-ToArc.ps1" -Value $arcDeployPsContent
    
  # Create Bash version of the deployment script
  $arcDeployShContent = @"
#!/bin/bash
# Azure Arc deployment script for ${SOLUTION_NAME}

# Variables
RESOURCE_GROUP="${SOLUTION_NAME}ResourceGroup"
LOCATION="eastus"
CLUSTER_NAME="${SOLUTION_NAME.ToLower()}-cluster"

# Create resource group
echo "Creating resource group..."
az group create --name \$RESOURCE_GROUP --location \$LOCATION

# Register the Azure Arc providers
echo "Registering Azure Arc providers..."
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation

# Connect your Kubernetes cluster to Azure Arc
# Note: You need to be logged in to your cluster with kubectl before running this
echo "Connecting Kubernetes cluster to Azure Arc..."
az connectedk8s connect --name \$CLUSTER_NAME --resource-group \$RESOURCE_GROUP

# Deploy the application to the Arc-connected cluster
echo "Deploying application to Arc-connected cluster..."
kubectl apply -f ../k8s/api-deployment.yaml
kubectl apply -f ../k8s/api-service.yaml
kubectl apply -f ../k8s/web-deployment.yaml
kubectl apply -f ../k8s/web-service.yaml
kubectl apply -f ../k8s/ingress.yaml

echo "Deployment to Azure Arc completed."
"@
  Set-Content -Path "infra/arc/deploy-to-arc.sh" -Value $arcDeployShContent
    
  Write-Log "Infrastructure components created successfully."
}

# Main function
function Main {
  Write-Log "Starting infrastructure creation..."
    
  # Create infrastructure
  Create-Infrastructure
    
  Write-Log "Infrastructure creation completed."
}

# Execute the script
Main