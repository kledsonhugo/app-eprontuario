#!/bin/bash

# Script para configurar certificado SSL no Application Gateway
# Este script configura HTTPS com certificado gerenciado pelo Azure

# Variáveis de configuração
RESOURCE_GROUP="rg-prontuario-medical"
APP_GATEWAY_NAME="agw-prontuario-medical"
DOMAIN_NAME="eprontuario.trafficmanager.net"  # Altere para seu domínio

echo "🔐 Configurando certificado SSL para HTTPS..."

# Obter IP público do Application Gateway
AGW_PUBLIC_IP=$(az network application-gateway show \
    --resource-group $RESOURCE_GROUP \
    --name $APP_GATEWAY_NAME \
    --query "frontendIpConfigurations[0].publicIpAddress.id" \
    --output tsv)

if [ -n "$AGW_PUBLIC_IP" ]; then
    AGW_IP_NAME=$(basename "$AGW_PUBLIC_IP")
    AGW_FQDN=$(az network public-ip show \
        --resource-group $RESOURCE_GROUP \
        --name $AGW_IP_NAME \
        --query "dnsSettings.fqdn" \
        --output tsv)
else
    AGW_FQDN="agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com"
fi

echo "🌐 Application Gateway FQDN: $AGW_FQDN"

# Opção 1: Certificado autoassinado (para testes)
echo "🔒 Criando certificado autoassinado para testes..."

# Gerar certificado autoassinado
openssl req -x509 -newkey rsa:4096 -keyout /tmp/agw-key.pem -out /tmp/agw-cert.pem -days 365 -nodes -subj "/CN=$AGW_FQDN"

# Converter para formato PFX
openssl pkcs12 -export -out /tmp/agw-cert.pfx -inkey /tmp/agw-key.pem -in /tmp/agw-cert.pem -passout pass:

# Upload do certificado para Application Gateway
az network application-gateway ssl-cert create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "agw-ssl-cert" \
    --cert-file /tmp/agw-cert.pfx

# Adicionar listener HTTPS
az network application-gateway frontend-port create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "https-port" \
    --port 443

# Criar HTTPS listener
az network application-gateway http-listener create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "https-listener" \
    --frontend-port "https-port" \
    --ssl-cert "agw-ssl-cert"

# Criar regra para HTTPS
az network application-gateway rule create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "https-rule" \
    --http-listener "https-listener" \
    --rule-type PathBasedRouting \
    --url-path-map "url-path-map"

# Configurar redirecionamento HTTP para HTTPS
az network application-gateway redirect-config create \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "http-to-https-redirect" \
    --type Permanent \
    --target-listener "https-listener"

# Atualizar regra HTTP para redirecionar para HTTPS
az network application-gateway rule update \
    --resource-group $RESOURCE_GROUP \
    --gateway-name $APP_GATEWAY_NAME \
    --name "rule1" \
    --redirect-config "http-to-https-redirect" \
    --remove urlPathMap

# Limpar arquivos temporários
rm -f /tmp/agw-*.pem /tmp/agw-*.pfx

echo "✅ Certificado SSL configurado com sucesso!"
echo ""
echo "🌐 URLs da aplicação com HTTPS:"
echo "Frontend: https://$AGW_FQDN"
echo "API: https://$AGW_FQDN/api"
echo ""
echo "⚠️ NOTA: Este é um certificado autoassinado para testes."
echo "   Para produção, você deve usar um certificado válido de uma CA."
echo ""
echo "📝 Para certificado de produção:"
echo "1. Obtenha um certificado SSL válido (Let's Encrypt, etc.)"
echo "2. Substitua o certificado autoassinado pelo certificado válido"
echo "3. Configure seu domínio personalizado para apontar para: $AGW_FQDN"
echo ""
echo "🔄 Próximo: Atualize as URLs da aplicação para usar HTTPS"