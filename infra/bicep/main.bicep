@description('The name of the solution')
param solutionName string = 'personalityframework'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The SKU of App Service Plan')
param appServicePlanSku string = 'P1v2'

@description('The name of the container registry')
param containerRegistryName string = '${solutionName}registry'

@description('The admin username for PostgreSQL')
param postgresAdminUsername string = 'postgres'

@description('The admin password for PostgreSQL')
@secure()
param postgresAdminPassword string

// Resource names
var appServicePlanName = '${solutionName}-plan'
var apiAppName = '${solutionName}-api'
var webAppName = '${solutionName}-web'
var postgresServerName = '${solutionName}-db'
var postgresDbName = '${solutionName}db'
var logAnalyticsName = '${solutionName}-logs'
var appInsightsName = '${solutionName}-insights'

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
    linuxFxVersion: 'DOCKER|${containerRegistry.name}.azurecr.io/${solutionName}-api:latest'
    appSettings: [
      {
        name: 'DOCKER_REGISTRY_SERVER_URL'
        value: 'https://${containerRegistry.name}.azurecr.io'
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
        value: 'Host=${postgresServer.name}.postgres.database.azure.com;Database=${postgresDbName};Username=${postgresAdminUsername};Password=${postgresAdminPassword}'
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
    linuxFxVersion: 'DOCKER|${containerRegistry.name}.azurecr.io/${solutionName}-web:latest'
    appSettings: [
      {
        name: 'DOCKER_REGISTRY_SERVER_URL'
        value: 'https://${containerRegistry.name}.azurecr.io'
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
        value: 'https://${apiApp.name}.azurewebsites.net'
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
output apiUrl string = 'https://${apiApp.properties.defaultHostName}'
output webUrl string = 'https://${webApp.properties.defaultHostName}'
output containerRegistryLoginServer string = containerRegistry.properties.loginServer
