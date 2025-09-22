// Configuração e variáveis globais
// API_BASE_URL é definido em api.js
let charts = {}; // Armazenar referências aos gráficos

console.log('=== ESTATÍSTICAS SIMPLES: Script carregado ===');

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== ESTATÍSTICAS SIMPLES: DOM carregado ===');
    console.log('API_BASE_URL disponível:', typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'UNDEFINED');
    
    // Configurar eventos dos botões
    const btnAtualizar = document.getElementById('btnAtualizar');
    
    if (btnAtualizar) {
        btnAtualizar.addEventListener('click', () => {
            console.log('Botão atualizar clicado');
            carregarEstatisticas();
        });
    }
    
    // Aguardar um pouco para garantir que tudo foi carregado
    console.log('Agendando carregamento em 1 segundo...');
    setTimeout(() => {
        console.log('Iniciando carregamento agendado...');
        carregarEstatisticas();
    }, 1000);
});

// Função principal para carregar as estatísticas
async function carregarEstatisticas() {
    console.log('=== FUNÇÃO carregarEstatisticas CHAMADA ===');
    
    try {
        console.log('=== Iniciando carregamento de estatísticas ===');
        console.log('API_BASE_URL na função:', API_BASE_URL);
        
        // Verificar se fetch está disponível
        if (typeof fetch === 'undefined') {
            throw new Error('fetch não está disponível');
        }
        
        console.log('Fetch está disponível');
        
        // Buscar dados da API
        console.log('Buscando pacientes...');
        console.log('URL completa:', `${API_BASE_URL}/pacientes`);
        
        const pacientesResponse = await fetch(`${API_BASE_URL}/pacientes`);
        console.log('Resposta dos pacientes recebida:', pacientesResponse.status, pacientesResponse.statusText);
        
        if (!pacientesResponse.ok) {
            throw new Error(`Erro ao buscar pacientes: ${pacientesResponse.status}`);
        }
        
        const pacientes = await pacientesResponse.json();
        console.log(`Pacientes carregados: ${pacientes.length}`);
        
        console.log('Buscando prontuários...');
        const prontuariosResponse = await fetch(`${API_BASE_URL}/prontuarios`);
        console.log('Resposta dos prontuários recebida:', prontuariosResponse.status, prontuariosResponse.statusText);
        
        if (!prontuariosResponse.ok) {
            throw new Error(`Erro ao buscar prontuários: ${prontuariosResponse.status}`);
        }
        
        const prontuarios = await prontuariosResponse.json();
        console.log(`Prontuários carregados: ${prontuarios.length}`);
        
        // Calcular estatísticas básicas
        console.log('Calculando estatísticas básicas...');
        const totalPacientes = pacientes.length;
        const totalProntuarios = prontuarios.length;
        const mediaProntuariosPorPaciente = totalPacientes > 0 
            ? (totalProntuarios / totalPacientes).toFixed(1) 
            : '0.0';
        
        console.log('Estatísticas:', { totalPacientes, totalProntuarios, mediaProntuariosPorPaciente });
        
        // Atualizar valores na interface
        console.log('Atualizando interface...');
        const elemTotalPacientes = document.getElementById('totalPacientes');
        const elemTotalProntuarios = document.getElementById('totalProntuarios');
        const elemMedia = document.getElementById('mediaProntuariosPorPaciente');
        
        console.log('Elementos encontrados:', {
            totalPacientes: !!elemTotalPacientes,
            totalProntuarios: !!elemTotalProntuarios,
            media: !!elemMedia
        });
        
        if (elemTotalPacientes) elemTotalPacientes.textContent = totalPacientes;
        if (elemTotalProntuarios) elemTotalProntuarios.textContent = totalProntuarios;
        if (elemMedia) elemMedia.textContent = mediaProntuariosPorPaciente;
        
        console.log('Valores básicos atualizados');
        
        // Criar gráfico de ausculta
        console.log('Criando gráfico de ausculta...');
        criarGraficoAusculta(prontuarios);
        
        // Mostrar conteúdo
        console.log('Atualizando visibilidade dos elementos...');
        const loadingState = document.getElementById('loadingState');
        const statisticsContent = document.getElementById('statisticsContent');
        const errorState = document.getElementById('errorState');
        
        console.log('Estados encontrados:', {
            loading: !!loadingState,
            content: !!statisticsContent,
            error: !!errorState
        });
        
        if (loadingState) {
            console.log('Ocultando loading...');
            loadingState.classList.add('d-none');
        }
        if (errorState) {
            console.log('Ocultando erro...');
            errorState.classList.add('d-none');
        }
        if (statisticsContent) {
            console.log('Mostrando conteúdo...');
            statisticsContent.classList.remove('d-none');
        }
        
        console.log('=== Carregamento concluído com sucesso ===');
        
    } catch (error) {
        console.error('=== ERRO ao carregar estatísticas ===', error);
        console.error('Tipo do erro:', error.constructor.name);
        console.error('Mensagem:', error.message);
        console.error('Stack:', error.stack);
        
        // Mostrar erro
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const errorMessage = document.getElementById('errorMessage');
        const statisticsContent = document.getElementById('statisticsContent');
        
        console.log('Mostrando estado de erro...');
        
        if (loadingState) loadingState.classList.add('d-none');
        if (statisticsContent) statisticsContent.classList.add('d-none');
        if (errorState) errorState.classList.remove('d-none');
        if (errorMessage) errorMessage.textContent = error.message;
        
        console.log('Estado de erro configurado');
    }
}

// Função para criar gráfico de ausculta
function criarGraficoAusculta(prontuarios) {
    console.log('=== Criando gráfico de ausculta ===');
    console.log('Prontuários recebidos:', prontuarios.length);
    
    try {
        // Contar occorrências de cada tipo de ausculta
        const auscultaCount = {};
        
        prontuarios.forEach(prontuario => {
            const ausculta = prontuario.ausculta || 'Não informado';
            auscultaCount[ausculta] = (auscultaCount[ausculta] || 0) + 1;
        });
        
        console.log('Contagem de ausculta:', auscultaCount);
        
        // Preparar dados para o gráfico
        const labels = Object.keys(auscultaCount);
        const data = Object.values(auscultaCount);
        
        console.log('Labels:', labels);
        console.log('Data:', data);
        
        // Obter o canvas
        const ctx = document.getElementById('auscultaChart');
        if (!ctx) {
            console.error('Canvas auscultaChart não encontrado');
            return;
        }
        
        console.log('Canvas encontrado, criando gráfico...');
        
        // Criar o gráfico
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade de Prontuários',
                    data: data,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribuição de Prontuários por Tipo de Ausculta'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
        
        console.log('Gráfico de ausculta criado com sucesso');
        
    } catch (error) {
        console.error('Erro ao criar gráfico de ausculta:', error);
    }
}