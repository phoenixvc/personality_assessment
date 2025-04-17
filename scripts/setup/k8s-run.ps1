# Kubernetes Run script for PersonalityFramework
# This script runs the application on local Kubernetes (minikube)

# Log function
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message"
}

# Error handling
function Exit-WithError {
    param([string]$Message)
    Write-Log "ERROR: $Message"
    exit 1
}

# Main script
Write-Log "Starting PersonalityFramework on local Kubernetes..."

# Check if minikube is installed
try {
    $minikubeVersion = minikube version
    Write-Log "Minikube version: $minikubeVersion"
} catch {
    Write-Log "WARNING: Minikube not found."
    
    $installChoice = Read-Host "Would you like to install Minikube? (y/n)"
    if ($installChoice -eq 'y') {
        Write-Log "Installing Minikube..."
        
        # Check if we're on Windows
        if ($env:OS -match 'Windows') {
            # Install using Chocolatey if available
            if (Get-Command choco -ErrorAction SilentlyContinue) {
                choco install minikube -y
            } else {
                Write-Log "Please download and install Minikube from https://minikube.sigs.k8s.io/docs/start/"
                Start-Process "https://minikube.sigs.k8s.io/docs/start/"
                
                Write-Log "After installing Minikube, please run this script again."
                exit 0
            }
        } else {
            Write-Log "Please install Minikube manually and try again."
            exit 0
        }
    } else {
        Exit-WithError "Minikube is required to run the application on local Kubernetes."
    }
}

# Start minikube if not running
$minikubeStatus = minikube status
if (-not ($minikubeStatus -match "Running")) {
    Write-Log "Starting Minikube..."
    minikube start
    
    if ($LASTEXITCODE -ne 0) {
        Exit-WithError "Failed to start Minikube."
    }
}

# Enable ingress addon
Write-Log "Enabling Ingress addon..."
minikube addons enable ingress
if ($LASTEXITCODE -ne 0) {
    Write-Log "WARNING: Failed to enable Ingress addon. Continuing anyway."
}

# Build Docker images
Write-Log "Building Docker images..."
Write-Log "Setting Docker environment to Minikube..."
minikube docker-env | Invoke-Expression

# Build API image
Write-Log "Building API image..."
docker build -t PersonalityFramework-api:latest -f ./PersonalityFramework.Api/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Exit-WithError "Failed to build API image."
}

# Build Web image
Write-Log "Building Web image..."
docker build -t PersonalityFramework-web:latest -f ./PersonalityFramework.Web/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Exit-WithError "Failed to build Web image."
}

# Apply Kubernetes manifests
Write-Log "Applying Kubernetes manifests..."
kubectl apply -f ./local-k8s/api-deployment.yaml
kubectl apply -f ./local-k8s/api-service.yaml
kubectl apply -f ./local-k8s/web-deployment.yaml
kubectl apply -f ./local-k8s/web-service.yaml
kubectl apply -f ./local-k8s/ingress.yaml

# Wait for deployments to be ready
Write-Log "Waiting for deployments to be ready..."
kubectl rollout status deployment/PersonalityFramework-api
kubectl rollout status deployment/PersonalityFramework-web

# Get the URL
Write-Log "Getting application URL..."
minikube service PersonalityFramework-web --url

Write-Log "PersonalityFramework is now running on local Kubernetes."
Write-Log "You can also access the application through the Ingress at: $(minikube ip)"
Write-Log "Add an entry to your hosts file: $(minikube ip) PersonalityFramework.local"
