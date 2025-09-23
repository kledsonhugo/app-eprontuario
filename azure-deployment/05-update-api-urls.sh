#!/bin/bash

# Script para atualizar URLs da API no frontend
# Use este script após o deploy para configurar as URLs corretas

if [ $# -eq 0 ]; then
    echo "❌ Erro: URL da API não fornecida"
    echo "📖 Uso: $0 <API_URL>"
    echo "📝 Exemplo: $0 https://prontuario-api.kindsky-12345.brazilsouth.azurecontainerapps.io"
    exit 1
fi

API_URL=$1
FRONTEND_DIR="../ProntuarioMedico.Web"

echo "🔧 Atualizando URLs da API no frontend..."
echo "🎯 Nova URL da API: $API_URL"

# Lista de arquivos JS que contêm URLs da API
JS_FILES=(
    "$FRONTEND_DIR/js/api.js"
    "$FRONTEND_DIR/js/criar-prontuario.js"
    "$FRONTEND_DIR/js/editar-prontuario.js"
    "$FRONTEND_DIR/js/detalhes-paciente.js"
    "$FRONTEND_DIR/js/pacientes.js"
    "$FRONTEND_DIR/js/prontuarios.js"
)

# Também verificar arquivos HTML inline
HTML_FILES=(
    "$FRONTEND_DIR/detalhes-paciente-simples.html"
    "$FRONTEND_DIR/detalhes-prontuario.html"
)

# Backup dos arquivos originais
echo "💾 Criando backup dos arquivos originais..."
for file in "${JS_FILES[@]}" "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$file.backup.$(date +%Y%m%d_%H%M%S)"
    fi
done

# Substituir URLs nos arquivos JS
echo "📝 Atualizando arquivos JavaScript..."
for file in "${JS_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  📄 Processando: $file"
        # Substituir localhost por nova URL
        sed -i.bak "s|http://localhost:5135|$API_URL|g" "$file"
        rm -f "$file.bak"
    fi
done

# Substituir URLs nos arquivos HTML
echo "📝 Atualizando arquivos HTML..."
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  📄 Processando: $file"
        # Substituir localhost por nova URL
        sed -i.bak "s|http://localhost:5135|$API_URL|g" "$file"
        rm -f "$file.bak"
    fi
done

echo "✅ URLs atualizadas com sucesso!"
echo ""
echo "🔄 Próximos passos:"
echo "1. Rebuild do container web:"
echo "   docker build -t <registry>/prontuario-web:latest ./ProntuarioMedico.Web/"
echo "2. Push da nova imagem:"
echo "   docker push <registry>/prontuario-web:latest"
echo "3. Atualizar o container app (se usando Container Apps):"
echo "   az containerapp update --name prontuario-web --resource-group rg-prontuario-medical --image <registry>/prontuario-web:latest"
echo ""
echo "💡 Para reverter as alterações, use os arquivos .backup criados"