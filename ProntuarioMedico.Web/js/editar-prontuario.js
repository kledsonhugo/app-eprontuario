// Configuração da API
const API_BASE_URL = 'https://eprontuario-e6ftdrftcdaqbycy.b02.azurefd.net/api';

// Elementos do DOM
const loading = document.getElementById('loading');
const erro = document.getElementById('erro');
const mensagemErro = document.getElementById('mensagemErro');
const formProntuario = document.getElementById('formProntuario');
const btnSalvar = document.getElementById('btnSalvar');
const btnVoltar = document.getElementById('btnVoltar');
const infoPaciente = document.getElementById('infoPaciente');

// Variáveis globais
let prontuarioAtual = null;
let pacienteAtual = null;

// Carregar dados iniciais ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarProntuario();
    
    // Configurar formulário
    formProntuario.addEventListener('submit', salvarProntuario);
    
    // Configurar botão voltar
    btnVoltar.addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const voltarPara = urlParams.get('voltarPara');
        
        if (voltarPara === 'paciente' && pacienteAtual) {
            window.location.href = `detalhes-paciente-simples.html?id=${pacienteAtual.id}`;
        } else {
            window.history.back();
        }
    });
});

// Função para carregar dados do prontuário
async function carregarProntuario() {
    try {
        // Obter ID do prontuário da URL
        const urlParams = new URLSearchParams(window.location.search);
        const prontuarioId = urlParams.get('id');
        
        if (!prontuarioId) {
            throw new Error('ID do prontuário não encontrado na URL');
        }
        
        // Carregar dados do prontuário
        const response = await fetch(`${API_BASE_URL}/prontuarios/${prontuarioId}`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        prontuarioAtual = await response.json();
        
        // Carregar dados do paciente
        await carregarPaciente(prontuarioAtual.pacienteId);
        
        // Preencher formulário
        preencherFormulario();
        
        // Esconder loading e mostrar formulário
        loading.classList.add('d-none');
        formProntuario.classList.remove('d-none');
        
    } catch (error) {
        console.error('Erro ao carregar prontuário:', error);
        loading.classList.add('d-none');
        mostrarErro(`Erro ao carregar prontuário: ${error.message}`);
    }
}

// Função para carregar dados do paciente
async function carregarPaciente(pacienteId) {
    try {
        const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        pacienteAtual = await response.json();
        
        // Exibir informações do paciente
        const formatDate = (dateString) => {
            if (!dateString) return 'Não informado';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        };
        
        infoPaciente.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <strong><i class="fas fa-user me-1"></i> Nome:</strong> ${pacienteAtual.nome}<br>
                    <strong><i class="fas fa-birthday-cake me-1"></i> Idade:</strong> ${pacienteAtual.idade} anos<br>
                    <strong><i class="fas fa-calendar me-1"></i> Data Nascimento:</strong> ${formatDate(pacienteAtual.dataNascimento)}
                </div>
                <div class="col-md-6">
                    <strong><i class="fas fa-map-marker-alt me-1"></i> Cidade:</strong> ${pacienteAtual.cidade}/${pacienteAtual.estado}<br>
                    <strong><i class="fas fa-mail-bulk me-1"></i> CEP:</strong> ${pacienteAtual.cep || 'Não informado'}<br>
                    <strong><i class="fas fa-home me-1"></i> Endereço:</strong> ${pacienteAtual.rua}, ${pacienteAtual.numero}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        infoPaciente.innerHTML = `
            <div class="text-danger">
                <i class="fas fa-exclamation-triangle me-1"></i>
                Erro ao carregar dados do paciente: ${error.message}
            </div>
        `;
    }
}

// Função para preencher o formulário com os dados do prontuário
function preencherFormulario() {
    if (!prontuarioAtual) return;
    
    // Campos hidden
    document.getElementById('prontuarioId').value = prontuarioAtual.id;
    document.getElementById('pacienteId').value = prontuarioAtual.pacienteId;
    
    // Atividade Física
    setSelectValue('frequenciaAtividade', prontuarioAtual.frequenciaAtividade);
    setSelectValue('tempoAtividade', prontuarioAtual.tempoAtividade);
    setSelectValue('locaisPraticaAtividade', prontuarioAtual.locaisPraticaAtividade);
    setSelectValue('tipoDeslocamento', prontuarioAtual.tipoDeslocamento);
    
    // Informações Médicas
    setSelectValue('pressao', prontuarioAtual.pressao);
    setSelectValue('ausculta', prontuarioAtual.ausculta);
    document.getElementById('historicoMedico').value = prontuarioAtual.historicoMedico || '';
    document.getElementById('evolucaoSaude').value = prontuarioAtual.evolucaoSaude || '';
    
    // Informações Adicionais
    setSelectValue('comoSoubeProjeto', prontuarioAtual.comoSoubeProjeto);
    setSelectValue('opiniaoHorarioAplicacao', prontuarioAtual.opiniaoHorarioAplicacao);
    document.getElementById('observacoes').value = prontuarioAtual.observacoes || '';
}

// Função auxiliar para definir valor em select
function setSelectValue(selectId, value) {
    const select = document.getElementById(selectId);
    if (select && value) {
        const option = Array.from(select.options).find(opt => opt.value === value);
        if (option) {
            select.value = value;
        }
    }
}

// Função para salvar as alterações do prontuário
async function salvarProntuario(event) {
    event.preventDefault();
    
    try {
        // Desabilitar botão e mostrar loading
        btnSalvar.disabled = true;
        btnSalvar.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Salvando alterações...';
        esconderErro();
        
        // Preparar dados
        const formData = new FormData(formProntuario);
        const dadosProntuario = {
            id: parseInt(formData.get('prontuarioId')),
            pacienteId: parseInt(formData.get('pacienteId')),
            frequenciaAtividade: formData.get('frequenciaAtividade') || '',
            tempoAtividade: formData.get('tempoAtividade') || '',
            locaisPraticaAtividade: formData.get('locaisPraticaAtividade') || '',
            comoSoubeProjeto: formData.get('comoSoubeProjeto') || '',
            tipoDeslocamento: formData.get('tipoDeslocamento') || '',
            opiniaoHorarioAplicacao: formData.get('opiniaoHorarioAplicacao') || '',
            historicoMedico: formData.get('historicoMedico') || '',
            evolucaoSaude: formData.get('evolucaoSaude') || '',
            pressao: formData.get('pressao') || '',
            ausculta: formData.get('ausculta') || '',
            observacoes: formData.get('observacoes') || '',
            // Manter a data de criação original
            dataCriacao: prontuarioAtual.dataCriacao
        };
        
        // Enviar para a API
        const response = await fetch(`${API_BASE_URL}/prontuarios/${dadosProntuario.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProntuario)
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Erro ${response.status}: ${errorData || response.statusText}`);
        }
        
        // Mostrar sucesso e redirecionar
        mostrarSucesso('Prontuário atualizado com sucesso!');
        
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const voltarPara = urlParams.get('voltarPara');
            
            if (voltarPara === 'paciente' && pacienteAtual) {
                window.location.href = `detalhes-paciente-simples.html?id=${pacienteAtual.id}`;
            } else {
                window.location.href = `detalhes-prontuario.html?id=${dadosProntuario.id}`;
            }
        }, 1500);
        
    } catch (error) {
        console.error('Erro ao salvar prontuário:', error);
        mostrarErro(`Erro ao salvar alterações: ${error.message}`);
    } finally {
        // Reabilitar botão
        btnSalvar.disabled = false;
        btnSalvar.innerHTML = '<i class="fas fa-save me-2"></i>Salvar Alterações';
    }
}

// Funções de controle de interface
function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    erro.classList.remove('d-none');
    erro.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function esconderErro() {
    erro.classList.add('d-none');
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

// Validação em tempo real
document.addEventListener('input', function(event) {
    if (event.target.matches('input, select, textarea')) {
        event.target.classList.remove('is-invalid');
        if (event.target.checkValidity()) {
            event.target.classList.add('is-valid');
        }
    }
});