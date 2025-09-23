#!/bin/bash

# Script para atualizar todas as URLs do Application Gateway para Azure Front Door

set -e

echo "🔄 Atualizando URLs para Azure Front Door..."

# URLs
OLD_URL="https://agw-prontuario-1758593555.brazilsouth.cloudapp.azure.com"
NEW_URL="https://eprontuario-e6ftdrftcdaqbycy.b02.azurefd.net"

echo "🌐 Substituindo:"
echo "   DE: $OLD_URL"
echo "   PARA: $NEW_URL"

# Função para atualizar arquivo
update_file() {
    local file="$1"
    
    if [ -f "$file" ]; then
        echo "📝 Atualizando $file..."
        
        # Backup
        cp "$file" "${file}.backup"
        
        # Substituir URL
        sed -i "s|$OLD_URL|$NEW_URL|g" "$file"
        
        # Verificar se houve mudança
        if ! cmp -s "$file" "${file}.backup"; then
            echo "✅ $file atualizado"
        else
            echo "ℹ️  $file não precisava de atualização"
            rm "${file}.backup"
        fi
    else
        echo "⚠️  Arquivo não encontrado: $file"
    fi
}

# Voltar para o diretório raiz do projeto
cd ..

echo ""
echo "📦 Atualizando arquivos JavaScript..."

# Atualizar todos os arquivos JS
find ProntuarioMedico.Web/js -name "*.js" -type f | while read file; do
    update_file "$file"
done

echo ""
echo "📄 Atualizando arquivos HTML..."

# Atualizar todos os arquivos HTML
find ProntuarioMedico.Web -name "*.html" -type f | while read file; do
    update_file "$file"
done

echo ""
echo "🔍 Verificando arquivos atualizados..."

# Verificar quais arquivos foram atualizados
UPDATED_FILES=$(find ProntuarioMedico.Web -name "*.backup" -type f | wc -l)

if [ "$UPDATED_FILES" -gt 0 ]; then
    echo "✅ $UPDATED_FILES arquivos foram atualizados:"
    find ProntuarioMedico.Web -name "*.backup" -type f | sed 's/\.backup$//' | sed 's/^/   - /'
    
    # Limpar backups
    find ProntuarioMedico.Web -name "*.backup" -type f -delete
    echo "🧹 Arquivos de backup removidos"
else
    echo "ℹ️  Nenhum arquivo precisou ser atualizado"
fi

echo ""
echo "🚀 Fazendo rebuild e deploy da nova imagem..."

# Rebuild da imagem Docker
docker build -t acrprontuariomedical.azurecr.io/prontuario-web:latest -f ProntuarioMedico.Web/Dockerfile .

# Push da nova imagem
docker push acrprontuariomedical.azurecr.io/prontuario-web:latest

# Reiniciar container
az container restart --name prontuario-web-aci --resource-group rg-prontuario-medical

echo ""
echo "🎉 Atualização concluída!"
echo ""
echo "🌐 Nova URL principal com certificado SSL válido:"
echo "   $NEW_URL"
echo ""
echo "✅ Benefícios:"
echo "   - Certificado SSL válido (sem avisos de segurança)"
echo "   - CDN global para melhor performance"
echo "   - Gerenciamento automático de certificados"
echo ""
echo "⏳ Aguarde 2-3 minutos para o container reiniciar"
echo "🧪 Teste em: $NEW_URL"