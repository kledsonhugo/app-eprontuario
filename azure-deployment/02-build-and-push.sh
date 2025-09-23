#!/bin/bash

# Script para build e push das imagens Docker para ACR
# Execute este script sempre que quiser atualizar as imagens

# Variáveis de configuração (ajuste conforme necessário)
ACR_NAME="acrprontuariomedical"
ACR_LOGIN_SERVER="$ACR_NAME.azurecr.io"
API_IMAGE_NAME="prontuario-api"
WEB_IMAGE_NAME="prontuario-web"
VERSION_TAG="latest"

echo "🏗️ Building e pushing imagens Docker para ACR..."

# Voltar para o diretório raiz do projeto
cd "$(dirname "$0")/.."

# Fazer login no ACR
echo "🔐 Fazendo login no ACR..."
az acr login --name $ACR_NAME

# Build e push da API
echo "🔨 Building API Docker image..."
docker build -t $ACR_LOGIN_SERVER/$API_IMAGE_NAME:$VERSION_TAG ./ProntuarioMedico.Api/

echo "📤 Pushing API image para ACR..."
docker push $ACR_LOGIN_SERVER/$API_IMAGE_NAME:$VERSION_TAG

# Build e push do Frontend
echo "🔨 Building Web Docker image..."
docker build -t $ACR_LOGIN_SERVER/$WEB_IMAGE_NAME:$VERSION_TAG ./ProntuarioMedico.Web/

echo "📤 Pushing Web image para ACR..."
docker push $ACR_LOGIN_SERVER/$WEB_IMAGE_NAME:$VERSION_TAG

# Listar imagens no registry
echo "📋 Imagens no ACR:"
az acr repository list --name $ACR_NAME --output table

echo "✅ Build e push concluídos!"
echo ""
echo "🎯 Próximos passos:"
echo "1. Execute o script de deploy (03-deploy-container-apps.sh)"
echo "2. Ou use Container Instances com (04-deploy-container-instances.sh)"