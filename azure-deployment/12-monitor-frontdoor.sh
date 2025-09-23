#!/bin/bash

# Script para monitorar o status do Azure Front Door
echo "⏳ Monitorando Azure Front Door..."

RESOURCE_GROUP="rg-prontuario-medical"
PROFILE_NAME="fd-prontuario-medical"
ENDPOINT_NAME="eprontuario"
FRONT_DOOR_URL="https://eprontuario-e6ftdrftcdaqbycy.b02.azurefd.net"

# Função para verificar status
check_status() {
    echo "🔍 $(date '+%H:%M:%S') - Verificando status do deployment..."
    
    # Verificar deployment status
    DEPLOYMENT_STATUS=$(az afd endpoint show \
        --resource-group $RESOURCE_GROUP \
        --profile-name $PROFILE_NAME \
        --endpoint-name $ENDPOINT_NAME \
        --query "deploymentStatus" \
        --output tsv 2>/dev/null)
    
    echo "   Deployment Status: $DEPLOYMENT_STATUS"
    
    # Testar conectividade
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $FRONT_DOOR_URL 2>/dev/null || echo "ERROR")
    echo "   HTTP Response: $HTTP_CODE"
    
    # Verificar se está funcionando
    if [[ "$HTTP_CODE" =~ ^[23][0-9][0-9]$ ]]; then
        echo "✅ Front Door está funcionando!"
        return 0
    elif [[ "$DEPLOYMENT_STATUS" == "Succeeded" ]]; then
        echo "🟡 Deployment concluído, aguardando propagação..."
        return 1
    else
        echo "🟡 Ainda configurando..."
        return 1
    fi
}

# Monitorar por até 20 minutos
MAX_ATTEMPTS=40
ATTEMPT=1

echo "📋 Monitorando por até 20 minutos..."
echo "URL do Front Door: $FRONT_DOOR_URL"
echo ""

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "🔄 Tentativa $ATTEMPT/$MAX_ATTEMPTS"
    
    if check_status; then
        echo ""
        echo "🎉 SUCESSO! Azure Front Door está pronto!"
        echo ""
        echo "✅ Certificado SSL válido configurado automaticamente"
        echo "✅ Sem avisos de segurança no navegador"
        echo "✅ CDN global ativo"
        echo ""
        echo "🌐 Acesse sua aplicação em:"
        echo "   $FRONT_DOOR_URL"
        echo ""
        echo "🧪 Testando endpoint da API..."
        API_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONT_DOOR_URL/api/pacientes" 2>/dev/null || echo "ERROR")
        echo "   API Response: $API_CODE"
        
        if [[ "$API_CODE" =~ ^[23][0-9][0-9]$ ]]; then
            echo "✅ API também está funcionando!"
        fi
        
        exit 0
    fi
    
    echo "   ⏳ Aguardando 30 segundos..."
    echo ""
    sleep 30
    ATTEMPT=$((ATTEMPT + 1))
done

echo ""
echo "⚠️ Timeout após 20 minutos. O Front Door pode precisar de mais tempo."
echo ""
echo "📋 Status atual:"
check_status
echo ""
echo "💡 Tente acessar manualmente em alguns minutos:"
echo "   $FRONT_DOOR_URL"