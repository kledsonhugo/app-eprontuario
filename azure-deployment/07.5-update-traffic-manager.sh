#!/bin/bash

# Script para atualizar Traffic Manager para usar HTTPS
# Este script atualiza o Traffic Manager para apontar para o Application Gateway com HTTPS

set -e

echo "🌐 Atualizando Traffic Manager para HTTPS..."

RESOURCE_GROUP="rg-prontuario-medical"
TRAFFIC_MANAGER="eprontuario"
AGW_PUBLIC_IP_NAME="pip-prontuario-gateway"

# Obter FQDN do Application Gateway
echo "🔍 Obtendo informações do Application Gateway..."
AGW_FQDN=$(az network public-ip show \
    --resource-group $RESOURCE_GROUP \
    --name $AGW_PUBLIC_IP_NAME \
    --query "dnsSettings.fqdn" \
    --output tsv)

if [ -z "$AGW_FQDN" ]; then
    echo "❌ Não foi possível obter o FQDN do Application Gateway"
    exit 1
fi

echo "✅ Application Gateway FQDN: $AGW_FQDN"

# Verificar se Traffic Manager existe
echo "🔍 Verificando Traffic Manager..."
if ! az network traffic-manager profile show --name $TRAFFIC_MANAGER --resource-group $RESOURCE_GROUP --output none 2>/dev/null; then
    echo "❌ Traffic Manager $TRAFFIC_MANAGER não encontrado"
    exit 1
fi
echo "✅ Traffic Manager encontrado: $TRAFFIC_MANAGER"

# Listar endpoints atuais
echo "📋 Endpoints atuais do Traffic Manager:"
az network traffic-manager endpoint list \
    --profile-name $TRAFFIC_MANAGER \
    --resource-group $RESOURCE_GROUP \
    --query '[].{Name:name, Target:target, Protocol:monitorConfig.protocol, Port:monitorConfig.port}' \
    --output table

# Atualizar endpoint existente para usar HTTPS
echo "🔧 Atualizando endpoint para usar Application Gateway com HTTPS..."

# Primeiro, vamos listar os endpoints para identificar o nome correto
ENDPOINT_NAME=$(az network traffic-manager endpoint list \
    --profile-name $TRAFFIC_MANAGER \
    --resource-group $RESOURCE_GROUP \
    --query '[0].name' \
    --output tsv)

if [ -z "$ENDPOINT_NAME" ]; then
    echo "❌ Nenhum endpoint encontrado no Traffic Manager"
    exit 1
fi

echo "🔧 Atualizando endpoint: $ENDPOINT_NAME"

# Atualizar o endpoint para apontar para o Application Gateway
az network traffic-manager endpoint update \
    --name "$ENDPOINT_NAME" \
    --profile-name $TRAFFIC_MANAGER \
    --resource-group $RESOURCE_GROUP \
    --type externalEndpoints \
    --target "$AGW_FQDN"

echo "✅ Endpoint atualizado para: $AGW_FQDN"

# Atualizar configuração de monitoramento para HTTPS
echo "🔧 Atualizando configuração de monitoramento para HTTPS..."
az network traffic-manager profile update \
    --name $TRAFFIC_MANAGER \
    --resource-group $RESOURCE_GROUP \
    --protocol HTTPS \
    --port 443 \
    --path "/"

echo "✅ Monitoramento configurado para HTTPS (porta 443)"

# Verificar configuração final
echo "📊 Configuração final do Traffic Manager:"
az network traffic-manager profile show \
    --name $TRAFFIC_MANAGER \
    --resource-group $RESOURCE_GROUP \
    --query '{name: name, dnsName: dnsConfig.fqdn, protocol: monitorConfig.protocol, port: monitorConfig.port, path: monitorConfig.path}' \
    --output table

echo ""
echo "📋 Endpoints atualizados:"
az network traffic-manager endpoint list \
    --profile-name $TRAFFIC_MANAGER \
    --resource-group $RESOURCE_GROUP \
    --query '[].{Name:name, Target:target, Status:endpointStatus}' \
    --output table

echo ""
echo "🎉 Traffic Manager atualizado com sucesso!"
echo "📍 URL principal da aplicação: https://eprontuario.trafficmanager.net"
echo "📍 Esta URL agora redireciona para: https://$AGW_FQDN"
echo ""
echo "⏳ Aguarde alguns minutos para o DNS se propagar..."
echo "🧪 Teste a aplicação em: https://eprontuario.trafficmanager.net"