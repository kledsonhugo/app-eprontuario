// Configuração da API
const API_BASE_URL = 'http://localhost:5135/api';

// Variáveis globais
let prontuarios = [];
let prontuarioParaExcluir = null;

// Elementos do DOM
const loading = document.getElementById('loading');
const erro = document.getElementById('erro');
const mensagemErro = document.getElementById('mensagemErro');
const listaProntuarios = document.getElementById('listaProntuarios');
const semProntuarios = document.getElementById('semProntuarios');
const filtroNome = document.getElementById('filtroNome');
const modalVisualizarProntuario = new bootstrap.Modal(document.getElementById('modalVisualizarProntuario'));
const modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));

// Carregar prontuários ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarProntuarios();
    
    // Configurar filtro
    filtroNome.addEventListener('input', filtrarProntuarios);
    
    // Configurar botão de limpar filtro
    document.getElementById('clearFilter').addEventListener('click', function() {
        filtroNome.value = '';
        filtrarProntuarios();
    });
    
    // Configurar modal de exclusão
    document.getElementById('confirmarExclusao').addEventListener('click', excluirProntuario);
});

// Função para carregar todos os prontuários
async function carregarProntuarios() {
    try {
        mostrarLoading();
        
        const response = await fetch(`${API_BASE_URL}/prontuarios`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        prontuarios = await response.json();
        
        esconderLoading();
        renderizarProntuarios();
        
    } catch (error) {
        console.error('Erro ao carregar prontuários:', error);
        mostrarErro(`Erro ao carregar prontuários: ${error.message}`);
    }
}

// Função para renderizar a lista de prontuários
function renderizarProntuarios() {
    const prontuariosFiltrados = filtrarProntuariosPorNome();
    
    if (prontuariosFiltrados.length === 0) {
        mostrarSemProntuarios();
        return;
    }
    
    const corpoTabela = document.getElementById('corpoTabela');
    const html = prontuariosFiltrados.map(prontuario => criarLinhaProntuario(prontuario)).join('');
    corpoTabela.innerHTML = html;
    
    // Atualizar contador de resultados
    atualizarContadorResultados(prontuariosFiltrados.length);
    
    mostrarListaProntuarios();
}

// Função para criar uma linha da tabela de prontuário
function criarLinhaProntuario(prontuario) {
    const dataFormatada = new Date(prontuario.dataCriacao).toLocaleDateString('pt-BR');
    
    return `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-user text-primary me-2"></i>
                    <div>
                        <div class="fw-semibold">${prontuario.pacienteNome}</div>
                        <small class="text-muted">ID: ${prontuario.pacienteId}</small>
                    </div>
                </div>
            </td>
            <td>${prontuario.pacienteIdade || '-'}</td>
            <td>
                <span class="badge bg-secondary">${prontuario.ausculta || 'Não informado'}</span>
            </td>
            <td>${prontuario.pressao || 'Não informada'}</td>
            <td>
                <small class="text-muted">${dataFormatada}</small>
            </td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-outline-primary btn-sm" onclick="visualizarProntuario(${prontuario.id})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <a href="editar-prontuario.html?id=${prontuario.id}" class="btn btn-outline-secondary btn-sm" title="Editar">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-outline-danger btn-sm" onclick="confirmarExclusaoProntuario(${prontuario.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Função para filtrar prontuários por nome do paciente
function filtrarProntuariosPorNome() {
    const filtro = filtroNome.value.toLowerCase().trim();
    
    if (!filtro) {
        return prontuarios;
    }
    
    return prontuarios.filter(prontuario => 
        prontuario.pacienteNome.toLowerCase().includes(filtro)
    );
}

// Função para aplicar filtros
function filtrarProntuarios() {
    renderizarProntuarios();
}

// Função para limpar filtros
function limparFiltros() {
    filtroNome.value = '';
    renderizarProntuarios();
}

// Função para visualizar detalhes do prontuário
async function visualizarProntuario(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/prontuarios/${id}`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const prontuario = await response.json();
        
        const conteudo = document.getElementById('conteudoProntuario');
        conteudo.innerHTML = criarConteudoVisualizacao(prontuario);
        
        // Configurar botão de editar
        document.getElementById('editarProntuario').onclick = () => {
            window.location.href = `editar-prontuario.html?id=${id}`;
        };
        
        modalVisualizarProntuario.show();
        
    } catch (error) {
        console.error('Erro ao carregar prontuário:', error);
        alert(`Erro ao carregar prontuário: ${error.message}`);
    }
}

// Função para criar o conteúdo de visualização do prontuário
function criarConteudoVisualizacao(prontuario) {
    return `
        <div class="row">
            <div class="col-12">
                <h6 class="text-primary mb-3">
                    <i class="fas fa-user me-2"></i>
                    Informações do Paciente
                </h6>
                <div class="bg-light p-3 rounded mb-4">
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Nome:</strong> ${prontuario.pacienteNome}<br>
                            <strong>Idade:</strong> ${prontuario.paciente?.idade || 'N/A'} anos
                        </div>
                        <div class="col-md-6">
                            <strong>Cidade:</strong> ${prontuario.paciente?.cidade || 'N/A'}<br>
                            <strong>Estado:</strong> ${prontuario.paciente?.estado || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-primary mb-3">
                    <i class="fas fa-running me-2"></i>
                    Atividade Física
                </h6>
                <div class="mb-3">
                    <strong>Frequência:</strong><br>
                    ${prontuario.frequenciaAtividade || 'Não informado'}
                </div>
                <div class="mb-3">
                    <strong>Tempo de Prática:</strong><br>
                    ${prontuario.tempoAtividade || 'Não informado'}
                </div>
                <div class="mb-3">
                    <strong>Locais de Prática:</strong><br>
                    ${prontuario.locaisPraticaAtividade || 'Não informado'}
                </div>
                <div class="mb-3">
                    <strong>Tipo de Deslocamento:</strong><br>
                    ${prontuario.tipoDeslocamento || 'Não informado'}
                </div>
            </div>
            
            <div class="col-md-6">
                <h6 class="text-primary mb-3">
                    <i class="fas fa-heartbeat me-2"></i>
                    Informações Médicas
                </h6>
                <div class="mb-3">
                    <strong>Pressão:</strong><br>
                    ${prontuario.pressao || 'Não informada'}
                </div>
                <div class="mb-3">
                    <strong>Ausculta:</strong><br>
                    ${prontuario.ausculta || 'Não informada'}
                </div>
                <div class="mb-3">
                    <strong>Histórico Médico:</strong><br>
                    ${prontuario.historicoMedico || 'Não informado'}
                </div>
                <div class="mb-3">
                    <strong>Evolução de Saúde:</strong><br>
                    ${prontuario.evolucaoSaude || 'Não informada'}
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <h6 class="text-primary mb-3">
                    <i class="fas fa-info-circle me-2"></i>
                    Informações Adicionais
                </h6>
                <div class="mb-3">
                    <strong>Como soube do projeto:</strong><br>
                    ${prontuario.comoSoubeProjeto || 'Não informado'}
                </div>
                <div class="mb-3">
                    <strong>Opinião sobre horário:</strong><br>
                    ${prontuario.opiniaoHorarioAplicacao || 'Não informada'}
                </div>
                <div class="mb-3">
                    <strong>Observações:</strong><br>
                    ${prontuario.observacoes || 'Nenhuma observação'}
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <hr>
                <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i>
                    Criado em: ${new Date(prontuario.dataCriacao).toLocaleString('pt-BR')}<br>
                    <i class="fas fa-edit me-1"></i>
                    Última atualização: ${new Date(prontuario.dataUltimaAtualizacao).toLocaleString('pt-BR')}
                </small>
            </div>
        </div>
    `;
}

// Função para confirmar exclusão
function confirmarExclusaoProntuario(id) {
    prontuarioParaExcluir = id;
    modalExcluir.show();
}

// Função para excluir prontuário
async function excluirProntuario() {
    if (!prontuarioParaExcluir) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/prontuarios/${prontuarioParaExcluir}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        modalExcluir.hide();
        prontuarioParaExcluir = null;
        
        // Recarregar lista
        await carregarProntuarios();
        
        // Mostrar sucesso
        mostrarSucesso('Prontuário excluído com sucesso!');
        
    } catch (error) {
        console.error('Erro ao excluir prontuário:', error);
        alert(`Erro ao excluir prontuário: ${error.message}`);
    }
}

// Funções de controle de interface
function mostrarLoading() {
    loading.classList.remove('d-none');
    erro.classList.add('d-none');
    listaProntuarios.classList.add('d-none');
    semProntuarios.classList.add('d-none');
}

function esconderLoading() {
    loading.classList.add('d-none');
}

function mostrarErro(mensagem) {
    esconderLoading();
    mensagemErro.textContent = mensagem;
    erro.classList.remove('d-none');
    listaProntuarios.classList.add('d-none');
    semProntuarios.classList.add('d-none');
}

function mostrarListaProntuarios() {
    listaProntuarios.classList.remove('d-none');
    erro.classList.add('d-none');
    semProntuarios.classList.add('d-none');
}

function mostrarSemProntuarios() {
    semProntuarios.classList.remove('d-none');
    erro.classList.add('d-none');
    listaProntuarios.classList.add('d-none');
    
    // Limpar contador de resultados
    const resultsSummary = document.getElementById('resultsSummary');
    if (resultsSummary) {
        resultsSummary.textContent = '';
    }
}

function mostrarSucesso(mensagem) {
    // Criar toast de sucesso
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-bg-success border-0 position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-check-circle me-2"></i>
                ${mensagem}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remover o toast após ser escondido
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toast);
    });
}

// Função para atualizar contador de resultados
function atualizarContadorResultados(total) {
    const resultsSummary = document.getElementById('resultsSummary');
    if (resultsSummary) {
        const texto = total === 1 ? '1 prontuário' : `${total} prontuários`;
        resultsSummary.textContent = `Mostrando ${texto}`;
    }
}