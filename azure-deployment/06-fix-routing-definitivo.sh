#!/bin/bash

set -e

echo "🔧 Configuração final correta do roteamento..."

RESOURCE_GROUP="rg-prontuario-medical"
AGW_NAME="agw-prontuario-medical"

echo "🔍 Verificando Application Gateway..."
if ! az network application-gateway show --name $AGW_NAME --resource-group $RESOURCE_GROUP --output none 2>/dev/null; then
    echo "❌ Application Gateway não encontrado"
    exit 1
fi
echo "✅ Application Gateway encontrado: $AGW_NAME"

echo ""
echo "📋 PROBLEMA IDENTIFICADO:"
echo "   - A rule1 é do tipo 'Basic' e aponta para web-backend-pool"
echo "   - Existe um URL path map com regra para /api/* → api-backend-pool"
echo "   - Mas a rule1 não está usando o URL path map!"
echo ""

echo "🔧 Atualizando rule1 para usar URL path map..."
az network application-gateway rule update \
    --gateway-name $AGW_NAME \
    --name rule1 \
    --resource-group $RESOURCE_GROUP \
    --rule-type PathBasedRouting \
    --url-path-map url-path-map \
    --remove backendAddressPool \
    --remove backendHttpSettings

echo "✅ Rule1 atualizada para usar path-based routing"

# Aguardar um pouco para aplicar as mudanças
echo "⏳ Aguardando Application Gateway aplicar as mudanças..."
sleep 15

echo "🧪 Testando roteamento..."

# Teste 1: API
echo "📋 Testando endpoint API..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com/api/pacientes 2>/dev/null || echo "ERRO")
echo "API response: $API_RESPONSE"

# Teste real da API
echo "📋 Testando conteúdo da API..."
curl -s http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com/api/pacientes | head -100

# Teste 2: Web
echo ""
echo "📋 Testando frontend web..."
WEB_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com 2>/dev/null || echo "ERRO")
echo "Web response: $WEB_RESPONSE"

# Verificar configuração final
echo ""
echo "📊 Configuração final:"
echo "🔹 Routing Rule:"
az network application-gateway rule show \
    --gateway-name $AGW_NAME \
    --name rule1 \
    --resource-group $RESOURCE_GROUP \
    --query '{name: name, ruleType: ruleType, urlPathMap: urlPathMap.id}' \
    --output table

echo ""
echo "🔹 URL Path Map:"
az network application-gateway url-path-map show \
    --gateway-name $AGW_NAME \
    --name url-path-map \
    --resource-group $RESOURCE_GROUP \
    --query '{defaultBackend: defaultBackendAddressPool.id, pathRules: pathRules[].{name: name, paths: paths, backend: backendAddressPool.id}}' \
    --output table

echo ""
echo "🎉 Configuração corrigida!"
echo "📍 Agora o roteamento funciona assim:"
echo "   - /api/* → api-backend-pool (container API)"
echo "   - Qualquer outro path → web-backend-pool (container Web) [padrão]"
echo ""
echo "📍 URLs para teste:"
echo "   - API: http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com/api/pacientes"
echo "   - Web: http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com"
echo ""
echo "✅ Pronto para configurar HTTPS!"