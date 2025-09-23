#!/bin/bash

# Script completo para configurar HTTPS na aplicação
# Este script executa todo o processo de configuração HTTPS

echo "🚀 Iniciando configuração completa de HTTPS..."
echo "================================="

# Tornar scripts executáveis
chmod +x azure-deployment/06-setup-https.sh
chmod +x azure-deployment/07-configure-ssl.sh
chmod +x azure-deployment/08-update-urls-https.sh

# Passo 1: Configurar Application Gateway
echo ""
echo "📋 PASSO 1: Configurando Application Gateway..."
echo "================================="
./azure-deployment/06-setup-https.sh

if [ $? -ne 0 ]; then
    echo "❌ Erro na configuração do Application Gateway"
    exit 1
fi

# Passo 2: Configurar SSL
echo ""
echo "📋 PASSO 2: Configurando certificado SSL..."
echo "================================="
./azure-deployment/07-configure-ssl.sh

if [ $? -ne 0 ]; then
    echo "❌ Erro na configuração do SSL"
    exit 1
fi

# Passo 3: Atualizar URLs
echo ""
echo "📋 PASSO 3: Atualizando URLs para HTTPS..."
echo "================================="
./azure-deployment/08-update-urls-https.sh

if [ $? -ne 0 ]; then
    echo "❌ Erro na atualização das URLs"
    exit 1
fi

# Passo 4: Rebuild e redeploy
echo ""
echo "📋 PASSO 4: Rebuilding e redeploying aplicação..."
echo "================================="

# Build nova imagem
echo "🔨 Building nova imagem..."
docker build -t acrprontuariomedical.azurecr.io/prontuario-web:latest -f ProntuarioMedico.Web/Dockerfile .

if [ $? -ne 0 ]; then
    echo "❌ Erro no build da imagem"
    exit 1
fi

# Push da imagem
echo "📤 Fazendo push da imagem..."
docker push acrprontuariomedical.azurecr.io/prontuario-web:latest

if [ $? -ne 0 ]; then
    echo "❌ Erro no push da imagem"
    exit 1
fi

# Redeploy container
echo "🔄 Redeployando container..."
az container delete --resource-group rg-prontuario-medical --name prontuario-web-aci --yes

sleep 10

az container create \
    --resource-group rg-prontuario-medical \
    --name prontuario-web-aci \
    --image acrprontuariomedical.azurecr.io/prontuario-web:latest \
    --registry-login-server acrprontuariomedical.azurecr.io \
    --registry-username acrprontuariomedical \
    --registry-password $(az acr credential show --name acrprontuariomedical --resource-group rg-prontuario-medical --query "passwords[0].value" --output tsv) \
    --dns-name-label prontuario-web-$(date +%s) \
    --ports 80 \
    --cpu 0.5 \
    --memory 1 \
    --os-type Linux \
    --restart-policy Always

# Obter URLs finais
RESOURCE_GROUP="rg-prontuario-medical"
APP_GATEWAY_NAME="agw-prontuario-medical"

AGW_PUBLIC_IP=$(az network application-gateway show \
    --resource-group $RESOURCE_GROUP \
    --name $APP_GATEWAY_NAME \
    --query "frontendIpConfigurations[0].publicIpAddress.id" \
    --output tsv)

AGW_IP_NAME=$(basename $AGW_PUBLIC_IP)
AGW_FQDN=$(az network public-ip show \
    --resource-group $RESOURCE_GROUP \
    --name $AGW_IP_NAME \
    --query "dnsSettings.fqdn" \
    --output tsv)

echo ""
echo "✅ CONFIGURAÇÃO HTTPS CONCLUÍDA!"
echo "================================="
echo ""
echo "🌐 URLs finais da aplicação:"
echo "Frontend (HTTPS): https://$AGW_FQDN"
echo "API (HTTPS): https://$AGW_FQDN/api"
echo "Swagger (HTTPS): https://$AGW_FQDN/api/swagger"
echo ""
echo "📝 Próximos passos:"
echo "1. Teste a aplicação em HTTPS"
echo "2. Atualize o Traffic Manager para usar: https://$AGW_FQDN"
echo "3. Configure seu domínio personalizado se desejar"
echo ""
echo "⚠️ NOTA: Certificado autoassinado - ideal para testes"
echo "   Para produção, substitua por certificado válido"