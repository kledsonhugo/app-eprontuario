#!/bin/bash

# Script para configurar HTTPS com Azure Application Gateway
# Este script configura SSL/TLS para a aplicação usando certificado gerenciado pelo Azure

# Variáveis de configuração
RESOURCE_GROUP="rg-prontuario-medical"
LOCATION="brazilsouth"
DOMAIN_NAME="eprontuario.trafficmanager.net"

# Application Gateway
APP_GATEWAY_NAME="agw-prontuario-medical"
PUBLIC_IP_NAME="pip-prontuario-gateway"
VNET_NAME="vnet-prontuario-medical"
SUBNET_NAME="subnet-gateway"

# Container Instances (backends)
API_BACKEND_FQDN="prontuario-api-1758591010.brazilsouth.azurecontainer.io"
WEB_BACKEND_FQDN="prontuario-web-1758592432.brazilsouth.azurecontainer.io"

echo "🔒 Configurando HTTPS com Azure Application Gateway..."

# Verificar se já existe uma VNet
echo "📝 Verificando rede virtual..."
VNET_EXISTS=$(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "name" --output tsv 2>/dev/null)

if [ -z "$VNET_EXISTS" ]; then
    echo "🌐 Criando rede virtual..."
    az network vnet create \
        --resource-group $RESOURCE_GROUP \
        --name $VNET_NAME \
        --address-prefix 10.0.0.0/16 \
        --subnet-name $SUBNET_NAME \
        --subnet-prefix 10.0.1.0/24
else
    echo "✅ Rede virtual já existe"
    # Verificar se subnet existe
    SUBNET_EXISTS=$(az network vnet subnet show --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --name $SUBNET_NAME --query "name" --output tsv 2>/dev/null)
    
    if [ -z "$SUBNET_EXISTS" ]; then
        echo "🌐 Criando subnet para Application Gateway..."
        az network vnet subnet create \
            --resource-group $RESOURCE_GROUP \
            --vnet-name $VNET_NAME \
            --name $SUBNET_NAME \
            --address-prefix 10.0.1.0/24
    else
        echo "✅ Subnet já existe"
    fi
fi

# Criar IP público para Application Gateway
echo "🌐 Criando IP público para Application Gateway..."
az network public-ip create \
    --resource-group $RESOURCE_GROUP \
    --name $PUBLIC_IP_NAME \
    --allocation-method Static \
    --sku Standard \
    --dns-name agw-prontuario-$(date +%s)

# Obter o FQDN do IP público
AGW_FQDN=$(az network public-ip show --resource-group $RESOURCE_GROUP --name $PUBLIC_IP_NAME --query "dnsSettings.fqdn" --output tsv)
echo "🔗 Application Gateway FQDN: $AGW_FQDN"

# Criar Application Gateway com configuração básica
echo "🚀 Criando Application Gateway..."
az network application-gateway create \
    --resource-group $RESOURCE_GROUP \
    --name $APP_GATEWAY_NAME \
    --location $LOCATION \
    --vnet-name $VNET_NAME \
    --subnet $SUBNET_NAME \
    --public-ip-address $PUBLIC_IP_NAME \
    --http-settings-cookie-based-affinity Disabled \
    --http-settings-port 80 \
    --http-settings-protocol Http \
    --frontend-port 80 \
    --sku Standard_v2 \
    --min-capacity 1 \
    --max-capacity 2 \
    --priority 1000

echo "⏳ Aguardando Application Gateway estar pronto..."
sleep 60

# Configurar backend pools
echo "📦 Configurando backend pools..."

# Backend pool para API
az network application-gateway address-pool create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "api-backend-pool" \
    --servers $API_BACKEND_FQDN

# Backend pool para Web
az network application-gateway address-pool create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "web-backend-pool" \
    --servers $WEB_BACKEND_FQDN

# Configurar health probes
echo "🏥 Configurando health probes..."

# Health probe para API
az network application-gateway probe create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "api-health-probe" \
    --protocol Http \
    --host $API_BACKEND_FQDN \
    --path "/api/pacientes" \
    --interval 30 \
    --timeout 120 \
    --threshold 3

# Health probe para Web
az network application-gateway probe create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "web-health-probe" \
    --protocol Http \
    --host $WEB_BACKEND_FQDN \
    --path "/" \
    --interval 30 \
    --timeout 120 \
    --threshold 3

# Configurar HTTP settings
echo "⚙️ Configurando HTTP settings..."

# HTTP settings para API
az network application-gateway http-settings create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "api-http-settings" \
    --port 8080 \
    --protocol Http \
    --cookie-based-affinity Disabled \
    --timeout 120 \
    --probe "api-health-probe" \
    --host-name $API_BACKEND_FQDN

# HTTP settings para Web  
az network application-gateway http-settings create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "web-http-settings" \
    --port 80 \
    --protocol Http \
    --cookie-based-affinity Disabled \
    --timeout 120 \
    --probe "web-health-probe" \
    --host-name $WEB_BACKEND_FQDN

# Configurar regras de roteamento
echo "🛣️ Configurando regras de roteamento..."

# Primeiro, vamos corrigir a regra padrão existente
echo "🔧 Atualizando regra padrão para usar web backend..."
az network application-gateway rule update \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "rule1" \
    --address-pool "web-backend-pool" \
    --http-settings "web-http-settings"

# Criar URL path map
echo "🗺️ Criando URL path map..."
az network application-gateway url-path-map create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "url-path-map" \
    --default-address-pool "web-backend-pool" \
    --default-http-settings "web-http-settings"

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

echo "✅ Application Gateway configurado com sucesso!"
echo ""
echo "📝 Próximos passos para HTTPS:"
echo "1. Configure um domínio personalizado apontando para: $AGW_FQDN"
echo "2. Execute o script 07-configure-ssl.sh após configurar o domínio"
echo "3. Atualize o Traffic Manager para usar o novo endpoint"
echo ""
echo "🌐 Endpoint temporário (HTTP): http://$AGW_FQDN"
echo ""
echo "⚠️ IMPORTANTE: Para HTTPS completo, você precisará:"
echo "   - Ter um domínio próprio ou usar um subdomínio"
echo "   - Configurar o DNS para apontar para o Application Gateway"
echo "   - Executar o próximo script para configurar SSL"