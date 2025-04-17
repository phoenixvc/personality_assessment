#!/bin/bash
# Azure Arc deployment script for PersonalityFramework

# Variables
RESOURCE_GROUP="PersonalityFrameworkResourceGroup"
LOCATION="eastus"
CLUSTER_NAME="-cluster"

# Create resource group
echo "Creating resource group..."
az group create --name \ --location \

# Register the Azure Arc providers
echo "Registering Azure Arc providers..."
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation

# Connect your Kubernetes cluster to Azure Arc
# Note: You need to be logged in to your cluster with kubectl before running this
echo "Connecting Kubernetes cluster to Azure Arc..."
az connectedk8s connect --name \ --resource-group \

# Deploy the application to the Arc-connected cluster
echo "Deploying application to Arc-connected cluster..."
kubectl apply -f ../k8s/api-deployment.yaml
kubectl apply -f ../k8s/api-service.yaml
kubectl apply -f ../k8s/web-deployment.yaml
kubectl apply -f ../k8s/web-service.yaml
kubectl apply -f ../k8s/ingress.yaml

echo "Deployment to Azure Arc completed."
