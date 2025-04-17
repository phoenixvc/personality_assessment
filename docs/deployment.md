# Deployment Guide

## Overview

This guide covers deploying the PersonalityFramework to various environments.

## Prerequisites

- Azure subscription
- Azure CLI installed
- Docker installed
- Kubernetes CLI (kubectl) installed

## Deployment Options

### 1. Azure Container Apps

#### Setup Azure Resources

`ash
# Login to Azure
az login

# Create Resource Group
az group create --name PersonalityFramework-rg --location eastus

# Create Container Registry
az acr create --name PersonalityFrameworkacr --resource-group PersonalityFramework-rg --sku Basic --admin-enabled true

# Create Container Apps Environment
az containerapp env create --name PersonalityFramework-env --resource-group PersonalityFramework-rg --location eastus
`

#### Build and Push Docker Images

`ash
# Build and tag API image
docker build -t PersonalityFrameworkacr.azurecr.io/PersonalityFramework-api:latest -f PersonalityFramework.Api/Dockerfile .

# Build and tag Web image
docker build -t PersonalityFrameworkacr.azurecr.io/PersonalityFramework-web:latest -f PersonalityFramework.Web/Dockerfile .

# Login to Azure Container Registry
az acr login --name PersonalityFrameworkacr

# Push images
docker push PersonalityFrameworkacr.azurecr.io/PersonalityFramework-api:latest
docker push PersonalityFrameworkacr.azurecr.io/PersonalityFramework-web:latest
`

#### Deploy to Container Apps

`ash
# Deploy API
az containerapp create --name PersonalityFramework-api --resource-group PersonalityFramework-rg --environment PersonalityFramework-env --image PersonalityFrameworkacr.azurecr.io/PersonalityFramework-api:latest --target-port 80 --ingress external

# Deploy Web
az containerapp create --name PersonalityFramework-web --resource-group PersonalityFramework-rg --environment PersonalityFramework-env --image PersonalityFrameworkacr.azurecr.io/PersonalityFramework-web:latest --target-port 80 --ingress external
`

### 2. Azure Kubernetes Service (AKS)

#### Setup AKS Cluster

`ash
# Create AKS cluster
az aks create --resource-group PersonalityFramework-rg --name PersonalityFramework-aks --node-count 2 --enable-addons monitoring --generate-ssh-keys

# Get AKS credentials
az aks get-credentials --resource-group PersonalityFramework-rg --name PersonalityFramework-aks
`

#### Deploy to AKS

`ash
# Apply Kubernetes manifests
kubectl apply -f ./infra/k8s/api-deployment.yaml
kubectl apply -f ./infra/k8s/api-service.yaml
kubectl apply -f ./infra/k8s/web-deployment.yaml
kubectl apply -f ./infra/k8s/web-service.yaml
kubectl apply -f ./infra/k8s/ingress.yaml
`

### 3. CI/CD Pipeline

The repository includes CI/CD pipeline configurations for:

- Azure DevOps (zure-pipelines.yml)
- GitHub Actions (.github/workflows/ci-cd.yml)

These pipelines automate the build, test, and deployment process.

## Environment Configuration

Configure environment variables for each environment:

- Development
- Staging
- Production

Example configuration in ppsettings.{Environment}.json:

`json
{
 "ConnectionStrings": {
   "DefaultConnection": "..."
 },
 "Authentication": {
   "Authority": "...",
   "Audience": "..."
 }
}
`

## Monitoring and Logging

After deployment, monitor the application using:

- Azure Application Insights
- Kubernetes Dashboard
- Container Apps Logs

