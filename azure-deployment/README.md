# 🚀 Guia de Deploy na Azure - Sistema de Prontuários Médicos

Este guia te ajudará a fazer o deploy da aplicação na Azure usando containers.

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

## 🎯 Opções de Deploy

Você tem duas opções principais:

### 🌟 Opção 1: Azure Container Instances (Recomendado para desenvolvimento)
- ✅ Mais simples e rápido
- ✅ Menor custo
- ❌ Menos recursos de scaling

### 🚀 Opção 2: Azure Container Apps (Recomendado para produção)
- ✅ Auto-scaling
- ✅ Mais recursos avançados
- ✅ Melhor para produção
- ❌ Mais complexo

## 📝 Passo a Passo

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

### 3️⃣ Deploy (Escolha uma opção)

#### Para Container Instances:
```bash
./03-deploy-container-instances.sh
```

#### Para Container Apps:
```bash
./04-deploy-container-apps.sh
```

### 4️⃣ Configurar URLs da API

Após o deploy, você receberá as URLs. Use o script para atualizar:

```bash
./05-update-api-urls.sh https://sua-api-url-aqui
```

Depois rebuild e push o frontend:
```bash
# Rebuild frontend com novas URLs
cd ..
docker build -t acrprontuariomedical.azurecr.io/prontuario-web:latest ./ProntuarioMedico.Web/
docker push acrprontuariomedical.azurecr.io/prontuario-web:latest

# Atualizar container (Container Apps)
az containerapp update --name prontuario-web --resource-group rg-prontuario-medical --image acrprontuariomedical.azurecr.io/prontuario-web:latest
```

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

### Ver logs:
```bash
# Container Instances
az container logs --resource-group rg-prontuario-medical --name prontuario-api-aci --follow

# Container Apps
az containerapp logs show --name prontuario-api --resource-group rg-prontuario-medical --follow
```

### Ver status:
```bash
# Container Instances
az container show --resource-group rg-prontuario-medical --name prontuario-api-aci --query "containers[0].instanceView.currentState"

# Container Apps
az containerapp show --name prontuario-api --resource-group rg-prontuario-medical --query "properties.runningStatus"
```

## 💰 Estimativa de Custos

### Container Instances:
- API (1 vCPU, 1.5GB RAM): ~$30-40/mês
- Web (0.5 vCPU, 1GB RAM): ~$15-20/mês
- **Total estimado: $45-60/mês**

### Container Apps:
- API + Web: ~$20-40/mês (com auto-scaling)
- **Total estimado: $20-40/mês**

## 🛠️ Comandos Úteis

### Atualizar aplicação:
```bash
# 1. Build nova versão
./02-build-and-push.sh

# 2. Atualizar containers
az containerapp update --name prontuario-api --resource-group rg-prontuario-medical --image acrprontuariomedical.azurecr.io/prontuario-api:latest
```

### Escalar manualmente (Container Apps):
```bash
az containerapp update --name prontuario-api --resource-group rg-prontuario-medical --min-replicas 2 --max-replicas 5
```

### Parar containers (Container Instances):
```bash
az container stop --resource-group rg-prontuario-medical --name prontuario-api-aci
```

### Deletar recursos:
```bash
az group delete --name rg-prontuario-medical --yes --no-wait
```

## 🔒 Configurar HTTPS (Opcional)

### Configuração Automática Completa

Para configurar HTTPS com certificado SSL automaticamente:

```bash
./09-deploy-https-complete.sh
```

### Configuração Manual (Passo a Passo)

#### 6️⃣ Configurar Application Gateway
```bash
./06-setup-https.sh
```

#### 7️⃣ Configurar Certificado SSL
```bash
./07-configure-ssl.sh
```

#### 8️⃣ Atualizar URLs para HTTPS
```bash
./08-update-urls-https.sh
```

### Características do HTTPS

- ✅ **Application Gateway** com SSL/TLS
- ✅ **Certificado autoassinado** (ideal para testes)
- ✅ **Redirecionamento HTTP → HTTPS** automático
- ✅ **Health probes** configurados
- ✅ **Load balancing** entre frontend e API

### Para Produção

Para usar em produção, substitua o certificado autoassinado por um certificado válido:

1. Obtenha um certificado SSL válido (Let's Encrypt, CA comercial, etc.)
2. Configure seu domínio personalizado
3. Substitua o certificado no Application Gateway
4. Atualize o Traffic Manager para usar HTTPS

## 🔒 Segurança

Para produção, considere:

1. **Custom Domain + SSL**
2. **Azure Key Vault** para secrets
3. **Virtual Network** para isolamento
4. **Application Gateway** para load balancing
5. **Azure SQL Database** em vez de SQLite

## 🆘 Troubleshooting

### Problema: Container não inicia
```bash
# Ver logs detalhados
az containerapp logs show --name prontuario-api --resource-group rg-prontuario-medical --follow

# Verificar configuração
az containerapp show --name prontuario-api --resource-group rg-prontuario-medical
```

### Problema: Frontend não consegue acessar API
1. Verifique se as URLs foram atualizadas no frontend
2. Verifique se a API está respondendo
3. Verifique configurações de CORS na API

### Problema: Banco de dados perdido
- Use Azure Database for PostgreSQL para persistência
- Configure volumes persistentes

## 📞 Suporte

Para dúvidas sobre este guia, consulte:
- [Documentação Azure Container Apps](https://docs.microsoft.com/azure/container-apps/)
- [Documentação Azure Container Instances](https://docs.microsoft.com/azure/container-instances/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)

---

**🎉 Boa sorte com seu deploy!**