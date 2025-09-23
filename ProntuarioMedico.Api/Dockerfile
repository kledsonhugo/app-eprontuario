# Dockerfile para API do Sistema de Prontuários Médicos
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ProntuarioMedico.Api/ProntuarioMedico.Api.csproj", "ProntuarioMedico.Api/"]
RUN dotnet restore "ProntuarioMedico.Api/ProntuarioMedico.Api.csproj"
COPY . .
WORKDIR "/src/ProntuarioMedico.Api"
RUN dotnet build "ProntuarioMedico.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ProntuarioMedico.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Criar diretório para o banco SQLite
RUN mkdir -p /app/data

# Variáveis de ambiente
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/prontuario.db"

ENTRYPOINT ["dotnet", "ProntuarioMedico.Api.dll"]