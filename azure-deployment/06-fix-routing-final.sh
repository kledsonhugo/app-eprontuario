#!/bin/bash

set -e

echo "🔧 Corrigindo configuração final de roteamento do Application Gateway..."

RESOURCE_GROUP="rg-prontuario-medical"
AGW_NAME="agw-prontuario-medical"

# Verificar se Application Gateway existe
echo "🔍 Verificando Application Gateway..."
if ! az network application-gateway show --name $AGW_NAME --resource-group $RESOURCE_GROUP --output none 2>/dev/null; then
    echo "❌ Application Gateway não encontrado"
    exit 1
fi
echo "✅ Application Gateway encontrado: $AGW_NAME"

# Primeiro, vamos remover a regra incorreta no URL path map
echo "🔧 Removendo regra incorreta do URL path map..."
az network application-gateway url-path-map rule delete \
    --gateway-name $AGW_NAME \
    --name default \
    --path-map-name url-path-map \
    --resource-group $RESOURCE_GROUP

echo "✅ Regra incorreta removida"

# Criar regra correta para API
echo "📋 Criando regra correta para API..."
az network application-gateway url-path-map rule create \
    --gateway-name $AGW_NAME \
    --name api-rule \
    --path-map-name url-path-map \
    --resource-group $RESOURCE_GROUP \
    --paths "/api/*" \
    --address-pool api-backend-pool \
    --http-settings api-http-settings

echo "✅ Regra API criada com sucesso"

# Verificar status final
echo "📊 Verificando configuração final..."
az network application-gateway url-path-map show \
    --gateway-name $AGW_NAME \
    --name url-path-map \
    --resource-group $RESOURCE_GROUP \
    --query '{defaultBackendPool: defaultBackendAddressPool.id, defaultHttpSettings: defaultBackendHttpSettings.id, pathRules: pathRules[].{name: name, paths: paths, pool: backendAddressPool.id}}' \
    --output table

echo ""
echo "🎉 Configuração de roteamento finalizada!"
echo "📍 Application Gateway URL: http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com"
echo "📍 API Endpoint: http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com/api/*"
echo "📍 Web Frontend: http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com"
echo ""
echo "🔍 Aguarde alguns minutos para o Application Gateway aplicar as mudanças..."