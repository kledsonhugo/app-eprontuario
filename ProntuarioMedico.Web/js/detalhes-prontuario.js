// Configuração da API
const API_BASE_URL = 'http://localhost:5135/api';

// Elementos do DOM
const loading = document.getElementById('loading');
const erro = document.getElementById('erro');
const mensagemErro = document.getElementById('mensagemErro');
const conteudoProntuario = document.getElementById('conteudoProntuario');

// Variáveis globais
let prontuarioAtual = null;

// Carregar dados ao inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarProntuario();
});

// Função para carregar dados do prontuário
async function carregarProntuario() {
    try {
        // Obter ID do prontuário da URL
        const urlParams = new URLSearchParams(window.location.search);
        const prontuarioId = urlParams.get('id');
        
        if (!prontuarioId) {
            throw new Error('ID do prontuário não fornecido na URL');
        }

        // Exibir loading
        loading.classList.remove('d-none');
        erro.classList.add('d-none');
        conteudoProntuario.classList.add('d-none');

        // Buscar dados do prontuário
        const response = await fetch(`${API_BASE_URL}/prontuarios/${prontuarioId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Prontuário não encontrado');
            }
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const prontuario = await response.json();
        prontuarioAtual = prontuario;

        // Preencher dados na página
        preencherDados(prontuario);

        // Exibir conteúdo
        loading.classList.add('d-none');
        conteudoProntuario.classList.remove('d-none');

    } catch (error) {
        console.error('Erro ao carregar prontuário:', error);
        
        // Exibir erro
        loading.classList.add('d-none');
        erro.classList.remove('d-none');
        mensagemErro.textContent = error.message;
    }
}

// Função para preencher dados na página
function preencherDados(prontuario) {
    // Informações do paciente
    document.getElementById('pacienteNome').textContent = prontuario.paciente?.nome || 'Não informado';
    document.getElementById('pacienteIdade').textContent = prontuario.paciente?.idade || 'Não informado';
    document.getElementById('pacienteCidade').textContent = prontuario.paciente ? 
        `${prontuario.paciente.cidade}/${prontuario.paciente.estado}` : 'Não informado';
    document.getElementById('dataRegistro').textContent = formatarData(prontuario.dataCriacao);

    // Informações de Atividade Física
    document.getElementById('frequenciaAtividade').textContent = prontuario.frequenciaAtividade || 'Não informado';
    document.getElementById('tempoAtividade').textContent = prontuario.tempoAtividade || 'Não informado';
    document.getElementById('locaisPraticaAtividade').textContent = prontuario.locaisPraticaAtividade || 'Não informado';
    document.getElementById('tipoDeslocamento').textContent = prontuario.tipoDeslocamento || 'Não informado';

    // Informações Médicas
    document.getElementById('pressao').textContent = prontuario.pressao || 'Não informado';
    document.getElementById('ausculta').textContent = prontuario.ausculta || 'Não informado';
    document.getElementById('historicoMedico').textContent = prontuario.historicoMedico || 'Não informado';
    document.getElementById('evolucaoSaude').textContent = prontuario.evolucaoSaude || 'Não informado';

    // Informações Adicionais
    document.getElementById('comoSoubeProjeto').textContent = prontuario.comoSoubeProjeto || 'Não informado';
    document.getElementById('opiniaoHorarioAplicacao').textContent = prontuario.opiniaoHorarioAplicacao || 'Não informado';
    document.getElementById('observacoes').textContent = prontuario.observacoes || 'Não informado';
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return 'Data não informada';
    
    const data = new Date(dataString);
    const opcoes = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return data.toLocaleDateString('pt-BR', opcoes);
}

// Função para voltar ao paciente
function voltarPaciente() {
    if (prontuarioAtual && prontuarioAtual.pacienteId) {
        window.location.href = `detalhes-paciente-simples.html?id=${prontuarioAtual.pacienteId}`;
    } else {
        // Fallback para lista de pacientes
        window.location.href = 'pacientes.html';
    }
}

// Função para editar prontuário
function editarProntuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const prontuarioId = urlParams.get('id');
    
    if (prontuarioId) {
        window.location.href = `editar-prontuario.html?id=${prontuarioId}&voltarPara=paciente`;
    }
}