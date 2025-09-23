#!/bin/bash

# Script para atualizar URLs da aplicação para HTTPS
# Este script atualiza todos os arquivos da aplicação para usar HTTPS

RESOURCE_GROUP="rg-prontuario-medical"
APP_GATEWAY_NAME="agw-prontuario-medical"

echo "🔄 Atualizando URLs da aplicação para HTTPS..."

# Obter FQDN do Application Gateway
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

HTTPS_API_URL="https://$AGW_FQDN/api"
HTTPS_WEB_URL="https://$AGW_FQDN"

echo "🌐 Nova URL da API: $HTTPS_API_URL"
echo "🌐 Nova URL do Frontend: $HTTPS_WEB_URL"

# Função para atualizar arquivo
update_api_url() {
    local file="$1"
    local old_url="$2"
    
    if [ -f "$file" ]; then
        echo "📝 Atualizando $file..."
        sed -i.bak "s|$old_url|$HTTPS_API_URL|g" "$file"
        echo "✅ $file atualizado"
    else
        echo "⚠️ Arquivo não encontrado: $file"
    fi
}

# Atualizar arquivos JavaScript
echo "📦 Atualizando arquivos JavaScript..."

update_api_url "../ProntuarioMedico.Web/js/api.js" "http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api"
update_api_url "../ProntuarioMedico.Web/js/config.js" "http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api"
update_api_url "../ProntuarioMedico.Web/js/criar-prontuario.js" "http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api"
update_api_url "../ProntuarioMedico.Web/js/detalhes-prontuario.js" "http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api"
update_api_url "../ProntuarioMedico.Web/js/editar-prontuario.js" "http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api"
update_api_url "../ProntuarioMedico.Web/js/prontuarios.js" "http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api"

# Atualizar arquivos HTML
echo "📄 Atualizando arquivos HTML..."

update_api_url "../ProntuarioMedico.Web/detalhes-paciente-simples.html" "http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api"
update_api_url "../ProntuarioMedico.Web/editar-paciente-simples.html" "http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api"

# Atualizar URL hardcoded em pacientes.js
if [ -f "../ProntuarioMedico.Web/js/pacientes.js" ]; then
    echo "📝 Atualizando pacientes.js..."
    sed -i.bak "s|http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api|$HTTPS_API_URL|g" "../ProntuarioMedico.Web/js/pacientes.js"
    echo "✅ pacientes.js atualizado"
fi

# Atualizar detalhes-paciente.js se houver URL hardcoded
if [ -f "../ProntuarioMedico.Web/js/detalhes-paciente.js" ]; then
    echo "📝 Atualizando detalhes-paciente.js..."
    sed -i.bak "s|http://prontuario-api-1758591010.brazilsouth.azurecontainer.io:8080/api|$HTTPS_API_URL|g" "../ProntuarioMedico.Web/js/detalhes-paciente.js"
    echo "✅ detalhes-paciente.js atualizado"
fi

echo ""
echo "✅ Todas as URLs foram atualizadas para HTTPS!"
echo ""
echo "📦 Próximos passos:"
echo "1. Rebuild e redeploy da imagem Docker do frontend"
echo "2. Atualizar o Traffic Manager para o novo endpoint"
echo "3. Testar a aplicação com HTTPS"
echo ""
echo "🌐 Novas URLs:"
echo "Frontend: $HTTPS_WEB_URL"
echo "API: $HTTPS_API_URL"
echo ""
echo "🔧 Para executar o rebuild:"
echo "docker build -t acrprontuariomedical.azurecr.io/prontuario-web:latest -f ProntuarioMedico.Web/Dockerfile ."
echo "docker push acrprontuariomedical.azurecr.io/prontuario-web:latest"