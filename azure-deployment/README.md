# 🚀 Deploy Simplificado na Azure - Sistema de Prontuários

**Arquitetura Otimizada:** ACR + ACI + Front Door

## 📋 Pré-requisitos

1. **Azure CLI** instalado e configurado
   ```bash
   # Instalar Azure CLI (Ubuntu/Debian)
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   # Fazer login
   az login
   ```

2. **Docker** instalado
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install docker.io
   sudo usermod -aG docker $USER
   ```

3. **Subscription ativa** na Azure com permissões para criar recursos

## 🎯 Arquitetura Simplificada

Esta versão usa apenas **3 serviços Azure** essenciais:

- **🗂️ Azure Container Registry (ACR)** - Armazenamento de imagens Docker
- **📦 Azure Container Instances (ACI)** - Hospedagem serverless dos containers  
- **🌐 Azure Front Door** - CDN global + SSL automático + Load Balancer

**✅ Vantagens:**
- SSL gerenciado automaticamente
- CDN global para performance mundial
- Alta disponibilidade sem complexidade

## 📝 Deploy em 6 Passos

### 1️⃣ Configurar Azure Container Registry

```bash
cd azure-deployment
chmod +x *.sh
./01-setup-acr.sh
```

**⚠️ Importante:** Salve as credenciais exibidas no final!

### 2️⃣ Build e Push das Imagens

```bash
./02-build-and-push.sh
```

### 3️⃣ Deploy dos Containers

```bash
./03-deploy-container-instances.sh
```

**⚠️ Anote as URLs** dos containers geradas no final!

### 4️⃣ Configurar Azure Front Door

```bash
./04-setup-azure-frontdoor.sh
```

**⚠️ Anote a URL do Front Door** gerada no final!

### 5️⃣ Corrigir Origens do Front Door

```bash
./05-fix-frontdoor-origins.sh
```

### 6️⃣ Atualizar URLs da Aplicação

```bash
./06-update-all-urls.sh
```

## 🎉 Deploy Concluído!

Após executar todos os scripts, sua aplicação estará disponível na URL do Front Door com:

- ✅ **SSL automático** - Certificado gerenciado pela Azure
- ✅ **CDN global** - Performance otimizada mundialmente  
- ✅ **Alta disponibilidade** - SLA 99.95%
- ✅ **Custo otimizado** - ~$88/mês

## 🔧 Testando Localmente

Antes do deploy na Azure, teste localmente:

```bash
# Build e run local
docker-compose up --build

# Acessar:
# Frontend: http://localhost:8080  
# API: http://localhost:5135
```

## 📊 Monitoramento

### Ver logs dos containers:
```bash
# API Container
az container logs --resource-group rg-prontuario-medical --name prontuario-api-aci --follow

# Web Container  
az container logs --resource-group rg-prontuario-medical --name prontuario-web-aci --follow
```

### Ver status dos recursos:
```bash
# Status dos containers
az container list --resource-group rg-prontuario-medical --output table

# Status do Front Door
az afd profile show --resource-group rg-prontuario-medical --profile-name fd-prontuario-medical --query "deploymentStatus"
```

## 🛠️ Comandos Úteis

### Atualizar aplicação:
```bash
# 1. Build nova versão
./02-build-and-push.sh

# 2. Restart containers para usar nova imagem
az container restart --resource-group rg-prontuario-medical --name prontuario-api-aci
az container restart --resource-group rg-prontuario-medical --name prontuario-web-aci
```

### Parar containers:
```bash
az container stop --resource-group rg-prontuario-medical --name prontuario-api-aci
az container stop --resource-group rg-prontuario-medical --name prontuario-web-aci
```

### Verificar URLs:
```bash
# URLs dos containers
az container show --resource-group rg-prontuario-medical --name prontuario-api-aci --query "ipAddress.fqdn"
az container show --resource-group rg-prontuario-medical --name prontuario-web-aci --query "ipAddress.fqdn"

# URL do Front Door
az afd endpoint show --resource-group rg-prontuario-medical --profile-name fd-prontuario-medical --endpoint-name eprontuario --query "hostName"
```

### Deletar recursos (limpeza):
```bash
az group delete --name rg-prontuario-medical --yes --no-wait
```


## 🆘 Troubleshooting

### Problema: Container não inicia
```bash
# Ver logs detalhados
az container logs --resource-group rg-prontuario-medical --name prontuario-api-aci --follow

# Verificar configuração
az container show --resource-group rg-prontuario-medical --name prontuario-api-aci
```

### Problema: Front Door não acessa containers
```bash
# Verificar origem configurada
az afd origin list --resource-group rg-prontuario-medical --profile-name fd-prontuario-medical --origin-group-name api-origin-group

# Testar conectividade direta ao container
curl http://CONTAINER-URL/api/pacientes
```

### Problema: Frontend não consegue acessar API
1. Verifique se as URLs foram atualizadas no frontend
2. Teste a API diretamente: `curl FRONT-DOOR-URL/api/pacientes`
3. Verifique configurações de CORS na API

### Problema: SSL/HTTPS não funciona
- O Front Door gerencia SSL automaticamente
- Aguarde até 15 minutos para propagação
- Verifique se está acessando a URL do Front Door (não do container)