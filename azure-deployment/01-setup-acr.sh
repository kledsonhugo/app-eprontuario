#!/bin/bash

# Script para configurar Azure Container Registry (ACR)
# Este script deve ser executado uma única vez para criar o registry

# Variáveis de configuração
RESOURCE_GROUP="rg-prontuario-medical"
ACR_NAME="acrprontuariomedical"
LOCATION="brazilsouth"
SUBSCRIPTION_ID="5a58073a-33d2-4213-bddc-000bc2420739"  # Substitua pelo seu subscription ID

echo "🚀 Configurando Azure Container Registry..."

# Fazer login no Azure (se necessário)
# echo "📝 Fazendo login no Azure..."
# az login

# Definir subscription (se fornecido)
# if [ ! -z "$SUBSCRIPTION_ID" ]; then
#     az account set --subscription $SUBSCRIPTION_ID
# fi

# Criar Resource Group
# echo "📦 Criando Resource Group..."
# az group create \
#     --name $RESOURCE_GROUP \
#     --location $LOCATION

# Criar Azure Container Registry
# echo "🏗️ Criando Azure Container Registry..."
# az acr create \
#     --resource-group $RESOURCE_GROUP \
#     --name $ACR_NAME \
#     --sku Basic \
#     --admin-enabled true

# Obter credenciais do ACR
echo "🔑 Obtendo credenciais do ACR..."
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "loginServer" --output tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "username" --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "passwords[0].value" --output tsv)

echo "✅ Azure Container Registry configurado com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "Login Server: $ACR_LOGIN_SERVER"
echo "Username: $ACR_USERNAME"
echo "Password: $ACR_PASSWORD"
echo ""
echo "💡 Salve essas informações para usar nos próximos scripts!"

# Fazer login no ACR
echo "🔐 Fazendo login no ACR..."
az acr login --name $ACR_NAME

echo "🎉 Configuração concluída!"