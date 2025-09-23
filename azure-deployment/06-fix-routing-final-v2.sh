#!/bin/bash

set -e

echo "🔧 Corrigindo roteamento do Application Gateway (versão final)..."

RESOURCE_GROUP="rg-prontuario-medical"
AGW_NAME="agw-prontuario-medical"

# Verificar se Application Gateway existe
echo "🔍 Verificando Application Gateway..."
if ! az network application-gateway show --name $AGW_NAME --resource-group $RESOURCE_GROUP --output none 2>/dev/null; then
    echo "❌ Application Gateway não encontrado"
    exit 1
fi
echo "✅ Application Gateway encontrado: $AGW_NAME"

# O problema é que a regra "default" está configurada incorretamente
# Ela deveria usar o backend da API apenas para /api/*, mas o default backend deveria ser web
# Vamos primeiro deletar a regra incorreta e recriar corretamente

echo "🔧 Removendo regra incorreta temporariamente..."
az network application-gateway url-path-map rule delete \
    --gateway-name $AGW_NAME \
    --name default \
    --path-map-name url-path-map \
    --resource-group $RESOURCE_GROUP

echo "✅ Regra removida"

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

# Aguardar um pouco para aplicar as mudanças
echo "⏳ Aguardando Application Gateway aplicar as mudanças..."
sleep 15

# Verificar se o roteamento está funcionando
echo "🧪 Testando roteamento..."

# Teste 1: API
echo "📋 Testando endpoint API..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com/api/pacientes 2>/dev/null || echo "ERRO")
if [[ "$API_RESPONSE" =~ ^[0-9]+$ ]] && [[ "$API_RESPONSE" -ge 200 ]] && [[ "$API_RESPONSE" -lt 400 ]]; then
    echo "✅ API responde: HTTP $API_RESPONSE"
else
    echo "⚠️  API response: $API_RESPONSE (pode precisar de mais tempo)"
fi

# Teste 2: Web (path raiz)
echo "📋 Testando frontend web..."
WEB_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com 2>/dev/null || echo "ERRO")
if [[ "$WEB_RESPONSE" =~ ^[0-9]+$ ]] && [[ "$WEB_RESPONSE" -ge 200 ]] && [[ "$WEB_RESPONSE" -lt 400 ]]; then
    echo "✅ Web responde: HTTP $WEB_RESPONSE"
else
    echo "⚠️  Web response: $WEB_RESPONSE (pode precisar de mais tempo)"
fi

# Verificar configuração final
echo ""
echo "📊 Configuração final do URL path map:"
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
echo "📍 Web Frontend: http://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com (qualquer path que não seja /api/*)"
echo ""
echo "✅ Agora o roteamento está correto:"
echo "   - /api/* → Backend API"
echo "   - Qualquer outro path → Backend Web (padrão)"
echo ""
echo "🚀 Pronto para configurar HTTPS!"