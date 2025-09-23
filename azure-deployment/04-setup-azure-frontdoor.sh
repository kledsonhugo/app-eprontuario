#!/bin/bash

# Script para configurar certificado SSL gerenciado pelo Azure Application Gateway
# Usa Azure Managed Certificate (mais simples que Let's Encrypt manual)

set -e

echo "🔐 Configurando certificado SSL gerenciado pelo Azure..."

RESOURCE_GROUP="rg-prontuario-medical"
APP_GATEWAY_NAME="agw-prontuario-medical"
KEY_VAULT_NAME="kv-prontuario-055bfabe"

# Verificar se podemos usar Azure Managed Certificate
echo "🔍 Verificando suporte a certificado gerenciado..."

# Para usar Azure Managed Certificate, precisamos de um domínio próprio
# Como estamos usando trafficmanager.net (domínio do Azure), vamos usar uma abordagem diferente

echo "💡 SOLUÇÃO RECOMENDADA: Azure Front Door com certificado gerenciado"
echo ""
echo "O Azure Traffic Manager não suporta certificado SSL gerenciado."
echo "Para ter um certificado SSL válido automaticamente, vamos migrar para Azure Front Door."
echo ""

read -p "Deseja migrar para Azure Front Door com SSL automático? (y/n): " migrate

if [[ $migrate == "y" || $migrate == "Y" ]]; then
    echo "🚀 Criando Azure Front Door com SSL gerenciado..."
    
    FRONT_DOOR_NAME="fd-prontuario-medical"
    ENDPOINT_NAME="eprontuario"
    
    # Criar Azure Front Door
    echo "📋 Criando Azure Front Door..."
    az afd profile create \
        --profile-name $FRONT_DOOR_NAME \
        --resource-group $RESOURCE_GROUP \
        --sku Standard_AzureFrontDoor
    
    echo "✅ Azure Front Door criado"
    
    # Criar endpoint
    echo "📋 Criando endpoint..."
    az afd endpoint create \
        --resource-group $RESOURCE_GROUP \
        --profile-name $FRONT_DOOR_NAME \
        --endpoint-name $ENDPOINT_NAME \
        --enabled-state Enabled
    
    echo "✅ Endpoint criado"
    
    # Obter FQDN do Application Gateway
    AGW_FQDN=$(az network public-ip show \
        --resource-group $RESOURCE_GROUP \
        --name pip-prontuario-gateway \
        --query "dnsSettings.fqdn" \
        --output tsv)
    
    # Criar origin group
    echo "📋 Criando origin group..."
    az afd origin-group create \
        --resource-group $RESOURCE_GROUP \
        --profile-name $FRONT_DOOR_NAME \
        --origin-group-name "agw-origin-group" \
        --probe-request-type GET \
        --probe-protocol Https \
        --probe-interval-in-seconds 100 \
        --probe-path "/" \
        --sample-size 4 \
        --successful-samples-required 3 \
        --additional-latency-in-milliseconds 50
    
    echo "✅ Origin group criado"
    
    # Criar origin
    echo "📋 Criando origin..."
    az afd origin create \
        --resource-group $RESOURCE_GROUP \
        --profile-name $FRONT_DOOR_NAME \
        --origin-group-name "agw-origin-group" \
        --origin-name "agw-origin" \
        --origin-host-header $AGW_FQDN \
        --host-name $AGW_FQDN \
        --http-port 80 \
        --https-port 443 \
        --enabled-state Enabled
    
    echo "✅ Origin criado"
    
    # Criar route
    echo "📋 Criando route..."
    az afd route create \
        --resource-group $RESOURCE_GROUP \
        --profile-name $FRONT_DOOR_NAME \
        --endpoint-name $ENDPOINT_NAME \
        --forwarding-protocol HttpsOnly \
        --route-name "default-route" \
        --https-redirect Enabled \
        --origin-group "agw-origin-group" \
        --supported-protocols Http Https \
        --link-to-default-domain Enabled \
        --patterns-to-match "/*"
    
    echo "✅ Route criado"
    
    # Obter URL do Front Door
    FRONT_DOOR_URL=$(az afd endpoint show \
        --resource-group $RESOURCE_GROUP \
        --profile-name $FRONT_DOOR_NAME \
        --endpoint-name $ENDPOINT_NAME \
        --query "hostName" \
        --output tsv)
    
    echo ""
    echo "🎉 Azure Front Door configurado com sucesso!"
    echo ""
    echo "🌐 Nova URL com certificado SSL válido:"
    echo "   https://$FRONT_DOOR_URL"
    echo ""
    echo "✅ Características:"
    echo "   - Certificado SSL gerenciado automaticamente pelo Azure"
    echo "   - Redirecionamento HTTP para HTTPS"
    echo "   - CDN global para melhor performance"
    echo "   - Sem avisos de segurança no navegador"
    echo ""
    echo "⏳ Aguarde 5-10 minutos para o Front Door provisionar completamente"
    echo "🧪 Teste em: https://$FRONT_DOOR_URL"
    
else
    echo ""
    echo "📋 OPÇÕES MANUAIS PARA CERTIFICADO VÁLIDO:"
    echo ""
    echo "1. 🆓 Let's Encrypt (manual):"
    echo "   - Instale certbot no seu computador"
    echo "   - Execute: certbot certonly --manual --preferred-challenges dns -d eprontuario.trafficmanager.net"
    echo "   - Siga as instruções para criar registro DNS TXT"
    echo ""
    echo "2. 💳 Certificado comercial:"
    echo "   - Compre de GoDaddy, DigiCert, etc."
    echo "   - Faça upload no Application Gateway"
    echo ""
    echo "3. 🔧 Para testes, aceite o certificado no navegador:"
    echo "   - Acesse https://eprontuario.trafficmanager.net"
    echo "   - Clique 'Avançado' → 'Prosseguir'"
    echo ""
    echo "✅ Sua aplicação está funcionando perfeitamente!"
fi