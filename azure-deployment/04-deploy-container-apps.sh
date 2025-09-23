#!/bin/bash

# Script para deploy usando Azure Container Apps (ACA)
# Solução mais robusta com auto-scaling e recursos avançados

# Variáveis de configuração
RESOURCE_GROUP="rg-prontuario-medical"
ACR_NAME="acrprontuariomedical"
ACR_LOGIN_SERVER="$ACR_NAME.azurecr.io"
LOCATION="brazilsouth"

# Nomes dos recursos
CONTAINERAPPS_ENV="env-prontuario-medical"
API_APP_NAME="prontuario-api"
WEB_APP_NAME="prontuario-web"

# Imagens
API_IMAGE="$ACR_LOGIN_SERVER/prontuario-api:latest"
WEB_IMAGE="$ACR_LOGIN_SERVER/prontuario-web:latest"

echo "🚀 Deploying para Azure Container Apps..."

# Instalar extensão do Container Apps (se necessário)
echo "📦 Verificando extensões do Azure CLI..."
az extension add --name containerapp --upgrade

# Registrar providers necessários
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights

# Obter credenciais do ACR
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "username" --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "passwords[0].value" --output tsv)

# Criar Container Apps Environment
echo "🏗️ Criando Container Apps Environment..."
az containerapp env create \
    --name $CONTAINERAPPS_ENV \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION

# Deploy da API
echo "📦 Deploying API Container App..."
az containerapp create \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINERAPPS_ENV \
    --image $API_IMAGE \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --target-port 8080 \
    --ingress external \
    --cpu 1.0 \
    --memory 2.0Gi \
    --min-replicas 1 \
    --max-replicas 3 \
    --env-vars \
        ASPNETCORE_ENVIRONMENT=Production \
        ASPNETCORE_URLS=http://+:8080

# Obter URL da API
API_URL=$(az containerapp show --name $API_APP_NAME --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" --output tsv)
API_URL="https://$API_URL"

echo "🔗 API URL: $API_URL"

# Deploy do Frontend
echo "📦 Deploying Web Container App..."
az containerapp create \
    --name $WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINERAPPS_ENV \
    --image $WEB_IMAGE \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --target-port 80 \
    --ingress external \
    --cpu 0.5 \
    --memory 1.0Gi \
    --min-replicas 1 \
    --max-replicas 2

# Obter URL do Frontend
WEB_URL=$(az containerapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" --output tsv)
WEB_URL="https://$WEB_URL"

echo "✅ Deploy concluído!"
echo ""
echo "🌐 URLs da aplicação:"
echo "Frontend: $WEB_URL"
echo "API: $API_URL"
echo ""
echo "⚠️ IMPORTANTE: Você precisará atualizar as URLs da API no frontend!"
echo "Edite os arquivos JS para apontar para: $API_URL"
echo ""
echo "📊 Para monitorar:"
echo "az containerapp logs show --name $API_APP_NAME --resource-group $RESOURCE_GROUP --follow"
echo "az containerapp logs show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --follow"
echo ""
echo "🔧 Para atualizar:"
echo "Use o script 02-build-and-push.sh e depois:"
echo "az containerapp update --name $API_APP_NAME --resource-group $RESOURCE_GROUP --image $API_IMAGE"
echo "az containerapp update --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --image $WEB_IMAGE"