# Dockerfile para Frontend do Sistema de Prontuários Médicos
FROM nginx:alpine

# Copiar arquivos estáticos
COPY ProntuarioMedico.Web/ /usr/share/nginx/html

# Configuração personalizada do nginx
COPY ProntuarioMedico.Web/nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]