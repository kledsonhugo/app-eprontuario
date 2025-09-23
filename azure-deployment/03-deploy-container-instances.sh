#!/bin/bash

# Script para deploy usando Azure Container Instances (ACI)
# Opção mais simples e econômica para desenvolvimento/teste

# Variáveis de configuração
RESOURCE_GROUP="rg-prontuario-medical"
ACR_NAME="acrprontuariomedical"
ACR_LOGIN_SERVER="$ACR_NAME.azurecr.io"
LOCATION="brazilsouth"

# Nomes dos containers
API_CONTAINER_NAME="prontuario-api-aci"
WEB_CONTAINER_NAME="prontuario-web-aci"

# Imagens
API_IMAGE="$ACR_LOGIN_SERVER/prontuario-api:latest"
WEB_IMAGE="$ACR_LOGIN_SERVER/prontuario-web:latest"

echo "🚀 Deploying para Azure Container Instances..."

# Obter credenciais do ACR
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "username" --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "passwords[0].value" --output tsv)

# Deploy da API
echo "📦 Deploying API container..."
az container create \
    --resource-group $RESOURCE_GROUP \
    --name $API_CONTAINER_NAME \
    --image $API_IMAGE \
    --registry-login-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --dns-name-label prontuario-api-$(date +%s) \
    --ports 8080 \
    --cpu 1 \
    --memory 1.5 \
    --os-type Linux \
    --environment-variables \
        ASPNETCORE_ENVIRONMENT=Production \
        ASPNETCORE_URLS=http://+:8080 \
        ConnectionStrings__DefaultConnection="Data Source=/app/data/prontuario.db" \
    --restart-policy Always

# Aguardar API estar pronta
echo "⏳ Aguardando API estar pronta..."
sleep 30

# Obter FQDN da API
API_FQDN=$(az container show --resource-group $RESOURCE_GROUP --name $API_CONTAINER_NAME --query "ipAddress.fqdn" --output tsv)
API_URL="http://$API_FQDN:8080"

echo "🔗 API URL: $API_URL"

# Deploy do Frontend
echo "📦 Deploying Web container..."
az container create \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_CONTAINER_NAME \
    --image $WEB_IMAGE \
    --registry-login-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --dns-name-label prontuario-web-$(date +%s) \
    --ports 80 \
    --cpu 0.5 \
    --memory 1 \
    --os-type Linux \
    --restart-policy Always

# Obter FQDN do Frontend
WEB_FQDN=$(az container show --resource-group $RESOURCE_GROUP --name $WEB_CONTAINER_NAME --query "ipAddress.fqdn" --output tsv)
WEB_URL="http://$WEB_FQDN"

echo "✅ Deploy concluído!"
echo ""
echo "🌐 URLs da aplicação:"
echo "Frontend: $WEB_URL"
echo "API: $API_URL"
echo ""
echo "⚠️ IMPORTANTE: Você precisará atualizar as URLs da API no frontend manualmente!"
echo "Edite os arquivos JS para apontar para: $API_URL"
echo ""
echo "📊 Para monitorar os containers:"
echo "az container logs --resource-group $RESOURCE_GROUP --name $API_CONTAINER_NAME"
echo "az container logs --resource-group $RESOURCE_GROUP --name $WEB_CONTAINER_NAME"