#!/bin/bash

# Script para finalizar configuração de roteamento do Application Gateway
# Use este script se o script 06 falhou na parte de roteamento

# Variáveis de configuração
RESOURCE_GROUP="rg-prontuario-medical"
APP_GATEWAY_NAME="agw-prontuario-medical"

echo "🔧 Finalizando configuração de roteamento do Application Gateway..."

# Verificar se Application Gateway existe
AGW_EXISTS=$(az network application-gateway show --resource-group $RESOURCE_GROUP --name $APP_GATEWAY_NAME --query "name" --output tsv 2>/dev/null)

if [ -z "$AGW_EXISTS" ]; then
    echo "❌ Application Gateway não encontrado. Execute o script 06 primeiro."
    exit 1
fi

echo "✅ Application Gateway encontrado: $APP_GATEWAY_NAME"

# Verificar se backends existem
echo "🔍 Verificando backend pools..."
API_POOL=$(az network application-gateway address-pool show --resource-group $RESOURCE_GROUP --gateway-name $APP_GATEWAY_NAME --name "api-backend-pool" --query "name" --output tsv 2>/dev/null)
WEB_POOL=$(az network application-gateway address-pool show --resource-group $RESOURCE_GROUP --gateway-name $APP_GATEWAY_NAME --name "web-backend-pool" --query "name" --output tsv 2>/dev/null)

if [ -z "$API_POOL" ] || [ -z "$WEB_POOL" ]; then
    echo "❌ Backend pools não encontrados. Verifique se o script 06 executou corretamente."
    exit 1
fi

echo "✅ Backend pools encontrados"

# Verificar se HTTP settings existem
echo "🔍 Verificando HTTP settings..."
API_HTTP=$(az network application-gateway http-settings show --resource-group $RESOURCE_GROUP --gateway-name $APP_GATEWAY_NAME --name "api-http-settings" --query "name" --output tsv 2>/dev/null)
WEB_HTTP=$(az network application-gateway http-settings show --resource-group $RESOURCE_GROUP --gateway-name $APP_GATEWAY_NAME --name "web-http-settings" --query "name" --output tsv 2>/dev/null)

if [ -z "$API_HTTP" ] || [ -z "$WEB_HTTP" ]; then
    echo "❌ HTTP settings não encontrados. Verifique se o script 06 executou corretamente."
    exit 1
fi

echo "✅ HTTP settings encontrados"

# Primeiro, vamos corrigir a regra padrão existente
echo "🔧 Atualizando regra padrão para usar web backend..."
az network application-gateway rule update \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "rule1" \
    --address-pool "web-backend-pool" \
    --http-settings "web-http-settings"

if [ $? -eq 0 ]; then
    echo "✅ Regra padrão atualizada com sucesso"
else
    echo "⚠️ Falha ao atualizar regra padrão, continuando..."
fi

# Verificar se URL path map já existe
URL_MAP_EXISTS=$(az network application-gateway url-path-map show --resource-group $RESOURCE_GROUP --gateway-name $APP_GATEWAY_NAME --name "url-path-map" --query "name" --output tsv 2>/dev/null)

if [ -z "$URL_MAP_EXISTS" ]; then
    # Criar URL path map
    echo "🗺️ Criando URL path map..."
    az network application-gateway url-path-map create \
        --resource-group $RESOURCE_GROUP \
        --gateway-name $APP_GATEWAY_NAME \
        --name "url-path-map" \
        --default-address-pool "web-backend-pool" \
        --default-http-settings "web-http-settings"
    
    if [ $? -eq 0 ]; then
        echo "✅ URL path map criado com sucesso"
    else
        echo "❌ Falha ao criar URL path map"
        exit 1
    fi
else
    echo "✅ URL path map já existe"
fi

# Verificar se regra para API já existe
API_RULE_EXISTS=$(az network application-gateway url-path-map rule show --resource-group $RESOURCE_GROUP --gateway-name $APP_GATEWAY_NAME --path-map-name "url-path-map" --name "api-path-rule" --query "name" --output tsv 2>/dev/null)

if [ -z "$API_RULE_EXISTS" ]; then
    # Adicionar regra para API no path map
    echo "📋 Adicionando regra para API..."
    az network application-gateway url-path-map rule create \
        --resource-group $RESOURCE_GROUP \
        --gateway-name $APP_GATEWAY_NAME \
        --path-map-name "url-path-map" \
        --name "api-path-rule" \
        --paths "/api/*" \
        --address-pool "api-backend-pool" \
        --http-settings "api-http-settings"
    
    if [ $? -eq 0 ]; then
        echo "✅ Regra API adicionada com sucesso"
    else
        echo "❌ Falha ao adicionar regra API"
        exit 1
    fi
else
    echo "✅ Regra API já existe"
fi

# Verificar se regra path-based já existe
PATH_RULE_EXISTS=$(az network application-gateway rule show --resource-group $RESOURCE_GROUP --gateway-name $APP_GATEWAY_NAME --name "path-based-rule" --query "name" --output tsv 2>/dev/null)

if [ -z "$PATH_RULE_EXISTS" ]; then
    # Criar regra de roteamento com path-based routing
    echo "🚦 Criando regra de roteamento principal..."
    az network application-gateway rule create \
        --resource-group $RESOURCE_GROUP \
        --gateway-name $APP_GATEWAY_NAME \
        --name "path-based-rule" \
        --http-listener "appGatewayHttpListener" \
        --rule-type PathBasedRouting \
        --url-path-map "url-path-map" \
        --priority 2000
    
    if [ $? -eq 0 ]; then
        echo "✅ Regra de roteamento criada com sucesso"
    else
        echo "❌ Falha ao criar regra de roteamento"
        exit 1
    fi
else
    echo "✅ Regra de roteamento já existe"
fi

# Obter FQDN do Application Gateway
AGW_FQDN=$(az network application-gateway show --resource-group $RESOURCE_GROUP --name $APP_GATEWAY_NAME --query "frontendIpConfigurations[0].publicIpAddress.id" --output tsv)
AGW_IP_NAME=$(basename $AGW_FQDN)
AGW_FQDN=$(az network public-ip show --resource-group $RESOURCE_GROUP --name $AGW_IP_NAME --query "dnsSettings.fqdn" --output tsv)

echo ""
echo "✅ Configuração de roteamento concluída com sucesso!"
echo ""
echo "🌐 Application Gateway URL: http://$AGW_FQDN"
echo ""
echo "📋 Configuração de roteamento:"
echo "- Frontend (padrão): http://$AGW_FQDN"
echo "- API: http://$AGW_FQDN/api/*"
echo ""
echo "🔧 Próximo passo: Execute ./07-configure-ssl.sh para adicionar HTTPS"