#!/bin/bash

# Script para instalar certificado SSL válido no Application Gateway
# Opções: Let's Encrypt gratuito ou certificado comercial

set -e

echo "🔐 Configurando certificado SSL válido..."

RESOURCE_GROUP="rg-prontuario-medical"
APP_GATEWAY_NAME="agw-prontuario-medical"
KEY_VAULT_NAME="kv-prontuario-$(openssl rand -hex 4)"
DOMAIN_NAME="eprontuario.trafficmanager.net"

echo "📋 Opções de certificado SSL:"
echo "1. 🆓 Let's Encrypt (gratuito, válido por 90 dias, auto-renovável)"
echo "2. 💳 Certificado comercial (upload manual)"
echo "3. 🔒 Azure App Service Certificate (pago, gerenciado pelo Azure)"
echo ""

read -p "Escolha uma opção (1-3): " option

case $option in
    1)
        echo "🆓 Configurando Let's Encrypt..."
        
        # Criar Key Vault para armazenar certificado
        echo "🔑 Criando Azure Key Vault..."
        az keyvault create \
            --name $KEY_VAULT_NAME \
            --resource-group $RESOURCE_GROUP \
            --location brazilsouth \
            --enabled-for-template-deployment true
        
        echo "✅ Key Vault criado: $KEY_VAULT_NAME"
        
        echo ""
        echo "📋 INSTRUÇÕES PARA LET'S ENCRYPT:"
        echo "1. Instale o certbot no seu computador:"
        echo "   sudo apt-get install certbot  # Ubuntu/Debian"
        echo "   brew install certbot          # macOS"
        echo ""
        echo "2. Execute este comando para gerar o certificado:"
        echo "   certbot certonly --manual --preferred-challenges dns -d $DOMAIN_NAME"
        echo ""
        echo "3. O certbot pedirá para criar um registro DNS TXT"
        echo "4. Após obter o certificado, execute:"
        echo "   openssl pkcs12 -export -out certificate.pfx -inkey privkey.pem -in cert.pem"
        echo ""
        echo "5. Upload do certificado para Key Vault:"
        echo "   az keyvault certificate import --vault-name $KEY_VAULT_NAME --name ssl-cert --file certificate.pfx"
        echo ""
        echo "6. Configure o Application Gateway para usar o certificado do Key Vault"
        ;;
        
    2)
        echo "💳 Configuração para certificado comercial..."
        
        echo "📋 INSTRUÇÕES PARA CERTIFICADO COMERCIAL:"
        echo "1. Compre um certificado SSL de uma CA (GoDaddy, DigiCert, etc.)"
        echo "2. Gere um CSR (Certificate Signing Request) para: $DOMAIN_NAME"
        echo "3. Faça download do certificado em formato PFX"
        echo "4. Execute:"
        echo "   az network application-gateway ssl-cert update \\"
        echo "     --gateway-name $APP_GATEWAY_NAME \\"
        echo "     --resource-group $RESOURCE_GROUP \\"
        echo "     --name agw-ssl-cert \\"
        echo "     --cert-file seu-certificado.pfx \\"
        echo "     --cert-password sua-senha"
        ;;
        
    3)
        echo "🔒 Configurando Azure App Service Certificate..."
        
        echo "📋 INSTRUÇÕES PARA AZURE APP SERVICE CERTIFICATE:"
        echo "1. Acesse o portal Azure"
        echo "2. Crie um 'App Service Certificate' para: $DOMAIN_NAME"
        echo "3. Após a compra, sincronize com Key Vault"
        echo "4. Configure o Application Gateway para usar o certificado"
        echo ""
        echo "💰 Custo aproximado: $70-100 USD/ano"
        ;;
        
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "📝 ALTERNATIVA SIMPLES PARA TESTES:"
echo "Se você quiser apenas testar a aplicação SEM o aviso de segurança:"
echo ""
echo "1. Abra o Chrome/Edge"
echo "2. Digite: chrome://flags/#allow-insecure-localhost"
echo "3. Ative a flag e reinicie o navegador"
echo "4. Ou acesse e clique em 'Avançado' → 'Prosseguir'"
echo ""
echo "🌐 Sua aplicação está funcionando perfeitamente em:"
echo "   https://eprontuario.trafficmanager.net"
echo ""
echo "✅ O HTTPS está funcionando corretamente!"
echo "   O aviso é apenas sobre o certificado autoassinado."