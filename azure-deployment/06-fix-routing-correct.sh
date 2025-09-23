#!/bin/bash

set -e

echo "🔧 Corrigindo configuração de roteamento do Application Gateway..."

RESOURCE_GROUP="rg-prontuario-medical"
AGW_NAME="agw-prontuario-medical"

# Verificar se Application Gateway existe
echo "🔍 Verificando Application Gateway..."
if ! az network application-gateway show --name $AGW_NAME --resource-group $RESOURCE_GROUP --output none 2>/dev/null; then
    echo "❌ Application Gateway não encontrado"
    exit 1
fi
echo "✅ Application Gateway encontrado: $AGW_NAME"

# Vamos renomear a regra existente para algo mais descritivo
echo "🔧 Atualizando regra existente para API..."
az network application-gateway url-path-map rule update \
    --gateway-name $AGW_NAME \
    --name default \
    --path-map-name url-path-map \
    --resource-group $RESOURCE_GROUP \
    --paths "/api/*" \
    --address-pool api-backend-pool \
    --http-settings api-http-settings

echo "✅ Regra API atualizada com sucesso"

# Verificar se o roteamento está funcionando
echo "🧪 Testando roteamento..."
sleep 10

# Teste 1: API
echo "📋 Testando endpoint API..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com/api/pacientes || echo "ERRO")
if [[ "$API_RESPONSE" =~ ^[0-9]+$ ]] && [[ "$API_RESPONSE" -ge 200 ]] && [[ "$API_RESPONSE" -lt 400 ]]; then
    echo "✅ API responde: HTTP $API_RESPONSE"
else
    echo "⚠️  API response: $API_RESPONSE"
fi

# Teste 2: Web
echo "📋 Testando frontend web..."
WEB_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com || echo "ERRO")
if [[ "$WEB_RESPONSE" =~ ^[0-9]+$ ]] && [[ "$WEB_RESPONSE" -ge 200 ]] && [[ "$WEB_RESPONSE" -lt 400 ]]; then
    echo "✅ Web responde: HTTP $WEB_RESPONSE"
else
    echo "⚠️  Web response: $WEB_RESPONSE"
fi

# Verificar configuração final
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
echo "⚠️  NOTA: O frontend web está configurado como default backend, então qualquer URL que não seja /api/* irá para o web"
echo "🔍 Se necessário, aguarde alguns minutos para o Application Gateway aplicar as mudanças..."