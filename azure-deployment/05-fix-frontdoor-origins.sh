#!/bin/bash

# Script para reconfigurar Front Door para apontar diretamente para os containers
# Evita problemas com certificado autoassinado do Application Gateway

set -e

echo "🔧 Reconfigurando Front Door para apontar diretamente aos containers..."

RESOURCE_GROUP="rg-prontuario-medical"
PROFILE_NAME="fd-prontuario-medical"
ENDPOINT_NAME="eprontuario"

# Obter FQDNs dos containers
WEB_FQDN=$(az container show --name prontuario-web-aci --resource-group $RESOURCE_GROUP --query "ipAddress.fqdn" --output tsv)
API_FQDN=$(az container show --name prontuario-api-aci --resource-group $RESOURCE_GROUP --query "ipAddress.fqdn" --output tsv)

echo "🌐 Web Container: $WEB_FQDN"
echo "🌐 API Container: $API_FQDN"

# Deletar origin atual
echo "🗑️ Removendo origin antigo..."
az afd origin delete \
    --resource-group $RESOURCE_GROUP \
    --profile-name $PROFILE_NAME \
    --origin-group-name agw-origin-group \
    --origin-name agw-origin \
    --yes

# Criar novo origin para Web container
echo "📋 Criando origin para Web container..."
az afd origin create \
    --resource-group $RESOURCE_GROUP \
    --profile-name $PROFILE_NAME \
    --origin-group-name agw-origin-group \
    --origin-name web-origin \
    --origin-host-header $WEB_FQDN \
    --host-name $WEB_FQDN \
    --http-port 80 \
    --https-port 443 \
    --enabled-state Enabled

echo "✅ Origin Web criado"

# Criar novo origin group para API
echo "📋 Criando origin group para API..."
az afd origin-group create \
    --resource-group $RESOURCE_GROUP \
    --profile-name $PROFILE_NAME \
    --origin-group-name "api-origin-group" \
    --probe-request-type GET \
    --probe-protocol Http \
    --probe-interval-in-seconds 100 \
    --probe-path "/api/pacientes" \
    --sample-size 4 \
    --successful-samples-required 3 \
    --additional-latency-in-milliseconds 50

echo "✅ API Origin group criado"

# Criar origin para API
echo "📋 Criando origin para API container..."
az afd origin create \
    --resource-group $RESOURCE_GROUP \
    --profile-name $PROFILE_NAME \
    --origin-group-name api-origin-group \
    --origin-name api-origin \
    --origin-host-header $API_FQDN \
    --host-name $API_FQDN \
    --http-port 8080 \
    --https-port 443 \
    --enabled-state Enabled

echo "✅ Origin API criado"

# Criar route para API
echo "📋 Criando route para API..."
az afd route create \
    --resource-group $RESOURCE_GROUP \
    --profile-name $PROFILE_NAME \
    --endpoint-name $ENDPOINT_NAME \
    --forwarding-protocol HttpOnly \
    --route-name "api-route" \
    --https-redirect Enabled \
    --origin-group "api-origin-group" \
    --supported-protocols Http Https \
    --patterns-to-match "/api/*" \
    --link-to-default-domain Enabled

echo "✅ Route API criado"

echo ""
echo "🎉 Reconfiguração concluída!"
echo ""
echo "📋 Nova arquitetura:"
echo "   - Front Door → Web Container (para paths gerais)"
echo "   - Front Door → API Container (para /api/*)"
echo "   - SSL gerenciado pelo Front Door"
echo ""
echo "⏳ Aguardando Front Door aplicar configurações (5-10 minutos)..."
echo "🌐 URL: https://eprontuario-e6ftdrftcdaqbycy.b02.azurefd.net"