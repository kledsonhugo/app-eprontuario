// Configuração e variáveis globais
// API_BASE_URL é definido em api.js
let charts = {}; // Armazenar referências aos gráficos

console.log('=== ESTATÍSTICAS: Script carregado ===');

// Paletas de cores para os gráficos
const colorPalette = [
    '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', 
    '#6f42c1', '#5a5c69', '#858796', '#2e59d9', '#17a673',
    '#2c9faf', '#f1c232', '#c1432e', '#5741a3', '#4e5055'
];

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== ESTATÍSTICAS: DOM carregado ===');
    console.log('API_BASE_URL disponível:', typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'UNDEFINED');
    
    // Configurar eventos dos botões
    const btnAtualizar = document.getElementById('btnAtualizar');
    const btnExportar = document.getElementById('btnExportar');
    
    console.log('Botões encontrados:', {
        btnAtualizar: !!btnAtualizar,
        btnExportar: !!btnExportar
    });
    
    if (btnAtualizar) {
        btnAtualizar.addEventListener('click', () => {
            console.log('Botão atualizar clicado');
            carregarEstatisticas();
        });
    }
    
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            console.log('Botão exportar clicado');
            exportarDados();
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
        console.log('Primeiro paciente:', pacientes[0]);
        
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
        
        // Calcular dados para gráficos apenas se a função existir
        if (typeof calcularEstatisticas === 'function') {
            console.log('Calculando estatísticas para gráficos...');
            const estatisticas = calcularEstatisticas(pacientes, prontuarios);
            console.log('Estatísticas calculadas:', estatisticas);
            
            // Criar gráficos se Chart.js estiver disponível
            if (typeof Chart !== 'undefined' && typeof criarOuAtualizarGraficos === 'function') {
                console.log('Criando gráficos...');
                criarOuAtualizarGraficos(estatisticas);
                console.log('Gráficos criados');
            } else {
                console.warn('Chart.js não disponível ou função criarOuAtualizarGraficos não existe, pulando criação de gráficos');
            }
        } else {
            console.warn('Função calcularEstatisticas não existe, pulando cálculos avançados');
        }
        
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

// Função principal para carregar as estatísticas
async function carregarEstatisticas() {
    try {
        console.log('========== Iniciando carregamento de estatísticas ==========');
        console.log('Chamando window.mostrarLoading...');
        window.mostrarLoading();
        console.log('Loading state mostrado');
        
        // Teste simples primeiro - vamos tentar apenas uma requisição
        console.log('Testando requisição simples para pacientes...');
        const response = await fetch(`${API_BASE_URL}/pacientes`);
        console.log('Resposta recebida:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const pacientes = await response.json();
        console.log('Pacientes recebidos:', pacientes.length, 'registros');
        
        // Teste simples - mostrar apenas a contagem básica
        document.getElementById('totalPacientes').textContent = pacientes.length;
        document.getElementById('totalProntuarios').textContent = '0';
        document.getElementById('mediaProntuariosPorPaciente').textContent = '0.0';
        
        console.log('Valores básicos atualizados');
        
        // Se chegou até aqui, mostrar conteúdo
        console.log('Chamando window.mostrarConteudo...');
        window.mostrarConteudo();
        console.log('========== Teste simples concluído ==========');
        
    } catch (error) {
        console.error('========== ERRO ao carregar estatísticas ==========');
        console.error('Erro:', error);
        console.error('Stack:', error.stack);
        window.mostrarErro(error.message);
    }
}

// Funções para buscar dados da API
async function buscarPacientes() {
    console.log('Buscando pacientes em:', `${API_BASE_URL}/pacientes`);
    const response = await fetch(`${API_BASE_URL}/pacientes`);
    
    console.log('Resposta pacientes:', response.status, response.statusText);
    
    if (!response.ok) {
        throw new Error(`Erro ao buscar pacientes: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados dos pacientes recebidos:', data);
    return data;
}

async function buscarProntuarios() {
    console.log('Buscando prontuários em:', `${API_BASE_URL}/prontuarios`);
    const response = await fetch(`${API_BASE_URL}/prontuarios`);
    
    console.log('Resposta prontuários:', response.status, response.statusText);
    
    if (!response.ok) {
        throw new Error(`Erro ao buscar prontuários: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados dos prontuários recebidos:', data);
    return data;
}

// Função para calcular as estatísticas
function calcularEstatisticas(pacientes, prontuarios) {
    console.log('Iniciando cálculo de estatísticas...');
    console.log('Pacientes recebidos:', pacientes);
    console.log('Prontuários recebidos:', prontuarios);
    
    try {
        // Estatísticas básicas
        const totalPacientes = pacientes.length;
        const totalProntuarios = prontuarios.length;
        const mediaProntuariosPorPaciente = totalPacientes > 0 
            ? (totalProntuarios / totalPacientes).toFixed(1) 
            : '0.0';
        
        console.log('Estatísticas básicas calculadas:', {
            totalPacientes,
            totalProntuarios,
            mediaProntuariosPorPaciente
        });
        
        // Mapeamento de prontuários por paciente para encontrar o último de cada
        const prontuariosPorPaciente = {};
        
        prontuarios.forEach((prontuario, index) => {
            console.log(`Processando prontuário ${index}:`, prontuario);
            const pacienteId = prontuario.pacienteId;
            
            if (!prontuariosPorPaciente[pacienteId] || 
                new Date(prontuario.dataCriacao) > new Date(prontuariosPorPaciente[pacienteId].dataCriacao)) {
                prontuariosPorPaciente[pacienteId] = prontuario;
            }
        });
        
        console.log('Mapeamento de prontuários por paciente:', prontuariosPorPaciente);
        
        // Contagem por estado
        console.log('Calculando contagem por estado...');
        const contagemPorEstado = contarPorPropriedade(pacientes, 'estado');
        console.log('Contagem por estado:', contagemPorEstado);
        
        // Contagem por cidade
        console.log('Calculando contagem por cidade...');
        const contagemPorCidade = contarPorPropriedade(pacientes, 'cidade');
        console.log('Contagem por cidade:', contagemPorCidade);
        
        // Pegar as 10 cidades mais frequentes se houver mais de 10
        let cidadesOrdenadas = Object.entries(contagemPorCidade)
            .sort((a, b) => b[1] - a[1]);
        
        if (cidadesOrdenadas.length > 10) {
            const top10 = cidadesOrdenadas.slice(0, 9);
            const outros = ['Outras Cidades', cidadesOrdenadas.slice(9).reduce((sum, item) => sum + item[1], 0)];
            cidadesOrdenadas = [...top10, outros];
        }
        
        console.log('Cidades ordenadas:', cidadesOrdenadas);
        
        // Contagem por pressão arterial do último prontuário
        const ultimosProntuarios = Object.values(prontuariosPorPaciente);
        console.log('Últimos prontuários:', ultimosProntuarios);
        
        console.log('Calculando contagem por pressão...');
        const contagemPorPressao = contarPorPropriedade(ultimosProntuarios, 'pressao');
        console.log('Contagem por pressão:', contagemPorPressao);
        
        // Contagem por ausculta do último prontuário
        console.log('Calculando contagem por ausculta...');
        const contagemPorAusculta = contarPorPropriedade(ultimosProntuarios, 'ausculta');
        console.log('Contagem por ausculta:', contagemPorAusculta);
        
        // Contagem por frequência de atividade do último prontuário
        console.log('Calculando contagem por frequência de atividade...');
        const contagemPorFrequenciaAtividade = contarPorPropriedade(ultimosProntuarios, 'frequenciaAtividade');
        console.log('Contagem por frequência de atividade:', contagemPorFrequenciaAtividade);
        
        const resultado = {
            totalPacientes,
            totalProntuarios,
            mediaProntuariosPorPaciente,
            contagemPorEstado,
            cidadesOrdenadas,
            contagemPorPressao,
            contagemPorAusculta,
            contagemPorFrequenciaAtividade
        };
        
        console.log('Estatísticas finais calculadas:', resultado);
        return resultado;
        
    } catch (error) {
        console.error('Erro ao calcular estatísticas:', error);
        throw error;
    }
}

// Função auxiliar para contar ocorrências de valores em uma propriedade
function contarPorPropriedade(array, propriedade) {
    const contagem = {};
    
    array.forEach(item => {
        const valor = item[propriedade] || 'Não informado';
        contagem[valor] = (contagem[valor] || 0) + 1;
    });
    
    return contagem;
}

// Funções para criar ou atualizar os gráficos
function criarOuAtualizarGraficos(estatisticas) {
    criarOuAtualizarGraficoPorEstado(estatisticas.contagemPorEstado);
    criarOuAtualizarGraficoPorCidade(estatisticas.cidadesOrdenadas);
    criarOuAtualizarGraficoPorPressao(estatisticas.contagemPorPressao);
    criarOuAtualizarGraficoPorAusculta(estatisticas.contagemPorAusculta);
    criarOuAtualizarGraficoPorFrequenciaAtividade(estatisticas.contagemPorFrequenciaAtividade);
}

function criarOuAtualizarGraficoPorEstado(contagemPorEstado) {
    const ctx = document.getElementById('chartEstados').getContext('2d');
    const labels = Object.keys(contagemPorEstado);
    const data = Object.values(contagemPorEstado);
    
    if (charts.estados) {
        charts.estados.data.labels = labels;
        charts.estados.data.datasets[0].data = data;
        charts.estados.update();
    } else {
        charts.estados = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pacientes por Estado',
                    data: data,
                    backgroundColor: gerarCores(labels.length),
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                return `${value} paciente${value !== 1 ? 's' : ''}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

function criarOuAtualizarGraficoPorCidade(cidadesOrdenadas) {
    const ctx = document.getElementById('chartCidades').getContext('2d');
    const labels = cidadesOrdenadas.map(item => item[0]);
    const data = cidadesOrdenadas.map(item => item[1]);
    
    if (charts.cidades) {
        charts.cidades.data.labels = labels;
        charts.cidades.data.datasets[0].data = data;
        charts.cidades.update();
    } else {
        charts.cidades = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: gerarCores(labels.length),
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

function criarOuAtualizarGraficoPorPressao(contagemPorPressao) {
    const ctx = document.getElementById('chartPressaoArterial').getContext('2d');
    const labels = Object.keys(contagemPorPressao);
    const data = Object.values(contagemPorPressao);
    
    if (charts.pressao) {
        charts.pressao.data.labels = labels;
        charts.pressao.data.datasets[0].data = data;
        charts.pressao.update();
    } else {
        charts.pressao = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pacientes por Pressão Arterial',
                    data: data,
                    backgroundColor: gerarCores(labels.length),
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }
}

function criarOuAtualizarGraficoPorAusculta(contagemPorAusculta) {
    const ctx = document.getElementById('chartAusculta').getContext('2d');
    const labels = Object.keys(contagemPorAusculta);
    const data = Object.values(contagemPorAusculta);
    
    if (charts.ausculta) {
        charts.ausculta.data.labels = labels;
        charts.ausculta.data.datasets[0].data = data;
        charts.ausculta.update();
    } else {
        charts.ausculta = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: gerarCores(labels.length),
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
}

function criarOuAtualizarGraficoPorFrequenciaAtividade(contagemPorFrequenciaAtividade) {
    const ctx = document.getElementById('chartFrequenciaAtividade').getContext('2d');
    const labels = Object.keys(contagemPorFrequenciaAtividade);
    const data = Object.values(contagemPorFrequenciaAtividade);
    
    if (charts.frequenciaAtividade) {
        charts.frequenciaAtividade.data.labels = labels;
        charts.frequenciaAtividade.data.datasets[0].data = data;
        charts.frequenciaAtividade.update();
    } else {
        charts.frequenciaAtividade = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pacientes por Frequência de Atividade',
                    data: data,
                    backgroundColor: gerarCores(labels.length),
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Função para gerar cores com base na paleta predefinida
function gerarCores(quantidade) {
    if (quantidade <= colorPalette.length) {
        return colorPalette.slice(0, quantidade);
    }
    
    // Se precisar de mais cores do que há na paleta, repetir com transparências diferentes
    const cores = [...colorPalette];
    
    while (cores.length < quantidade) {
        const indice = cores.length % colorPalette.length;
        const cor = colorPalette[indice];
        const transparencia = 0.5 + (Math.random() * 0.5); // Entre 0.5 e 1.0
        
        // Converter hex para rgba
        const r = parseInt(cor.slice(1, 3), 16);
        const g = parseInt(cor.slice(3, 5), 16);
        const b = parseInt(cor.slice(5, 7), 16);
        
        cores.push(`rgba(${r}, ${g}, ${b}, ${transparencia})`);
    }
    
    return cores;
}

// Função para exportar os dados como CSV
function exportarDados() {
    try {
        const totalPacientes = document.getElementById('totalPacientes').textContent;
        const totalProntuarios = document.getElementById('totalProntuarios').textContent;
        const mediaProntuariosPorPaciente = document.getElementById('mediaProntuariosPorPaciente').textContent;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Cabeçalho
        csvContent += "Estatísticas do Sistema de Prontuários - Exportado em " + new Date().toLocaleDateString('pt-BR') + "\n\n";
        
        // Resumo
        csvContent += "Resumo Geral\n";
        csvContent += "Total de Pacientes," + totalPacientes + "\n";
        csvContent += "Total de Prontuários," + totalProntuarios + "\n";
        csvContent += "Média de Prontuários por Paciente," + mediaProntuariosPorPaciente + "\n\n";
        
        // Dados de cada gráfico
        for (const [tipo, grafico] of Object.entries(charts)) {
            const titulo = getTituloGrafico(tipo);
            csvContent += `${titulo}\n`;
            csvContent += "Categoria,Quantidade\n";
            
            for (let i = 0; i < grafico.data.labels.length; i++) {
                const label = grafico.data.labels[i];
                const valor = grafico.data.datasets[0].data[i];
                csvContent += `"${label}",${valor}\n`;
            }
            
            csvContent += "\n";
        }
        
        // Criar o link para download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "estatisticas_sistema_" + new Date().toISOString().split('T')[0] + ".csv");
        document.body.appendChild(link);
        
        // Simular clique para baixar
        link.click();
        
        // Remover o link
        document.body.removeChild(link);
        
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        alert('Erro ao exportar dados: ' + error.message);
    }
}

// Função auxiliar para obter o título do gráfico
function getTituloGrafico(tipo) {
    const titulos = {
        'estados': 'Pacientes por Estado',
        'cidades': 'Pacientes por Cidade',
        'pressao': 'Pacientes por Pressão Arterial',
        'ausculta': 'Pacientes por Ausculta',
        'frequenciaAtividade': 'Pacientes por Frequência de Atividade'
    };
    
    return titulos[tipo] || tipo;
}

// Funções de controle de interface
// Essas funções foram movidas para dentro do DOMContentLoaded
// e estão disponíveis como window.mostrarLoading, window.mostrarConteudo e window.mostrarErro