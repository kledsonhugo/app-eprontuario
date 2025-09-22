// Patient details functionality
let currentPatient = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing patient details...');
    initializePatientDetails();
});

function initializePatientDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    
    console.log('Initializing with patientId:', patientId);
    
    if (!patientId) {
        showError('ID do paciente não fornecido');
        return;
    }
    
    loadPatientData(patientId);
    setupEventListeners();
}

async function loadPatientData(patientId) {
    try {
        console.log('Loading patient data for ID:', patientId);
        
        // Mostrar estado de carregamento usando a função existente
        showLoadingState();
        
        console.log('Chamando API diretamente para obter paciente...');
        // Usando fetch diretamente para evitar problemas com apiService
        const apiUrl = `http://localhost:5135/api/pacientes/${patientId}`;
        console.log('URL da API:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        
        const patient = await response.json();
        console.log('Patient data received:', patient);
        
        currentPatient = patient;
        
        console.log('Displaying patient data...');
        displayPatientData(patient);
        
        // Mostrar detalhes do paciente usando a função existente
        showPatientDetails();
        
        console.log('Patient data loaded successfully');
        
    } catch (error) {
        console.error('Error loading patient data:', error);
        showError(`Erro ao carregar dados do paciente: ${error.message}`);
    }
}

function displayPatientData(patient) {
    // Função local para formatar data caso Utils.formatDate não esteja disponível
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch (e) {
            console.error('Erro ao formatar data:', e);
            return dateString || '-';
        }
    };
    
    // Função para usar Utils.formatDate se disponível, caso contrário usar formatDate local
    const formatDateSafe = (dateString) => {
        if (window.Utils && typeof window.Utils.formatDate === 'function') {
            return window.Utils.formatDate(dateString) || '-';
        }
        return formatDate(dateString);
    };
    
    // Update page title
    document.getElementById('pageTitle').innerHTML = `
        <i class="bi bi-person-circle"></i>
        ${patient.nome}
    `;
    
    // Dados Pessoais
    document.getElementById('nome').textContent = patient.nome || '-';
    document.getElementById('idade').textContent = patient.idade ? `${patient.idade} anos` : '-';
    document.getElementById('dataNascimento').textContent = formatDateSafe(patient.dataNascimento);
    
    // Address fields
    document.getElementById('rua').textContent = patient.rua || '-';
    document.getElementById('numero').textContent = patient.numero || '-';
    document.getElementById('complemento').textContent = patient.complemento || '-';
    document.getElementById('bairro').textContent = patient.bairro || '-';
    document.getElementById('cidade').textContent = patient.cidade || '-';
    document.getElementById('estado').textContent = patient.estado || '-';
    
    // Informações de Atividade Física
    document.getElementById('frequenciaAtividade').textContent = patient.frequenciaAtividade || '-';
    document.getElementById('tempoAtividade').textContent = patient.tempoAtividade || '-';
    document.getElementById('locaisPraticaAtividade').textContent = patient.locaisPraticaAtividade || '-';
    document.getElementById('comoSoubeProjeto').textContent = patient.comoSoubeProjeto || '-';
    document.getElementById('tipoDeslocamento').textContent = patient.tipoDeslocamento || '-';
    document.getElementById('opiniaoHorarioAplicacao').textContent = patient.opiniaoHorarioAplicacao || '-';
    
    // Informações Médicas
    displayLongText('historicoMedico', patient.historicoMedico);
    displayLongText('evolucaoSaude', patient.evolucaoSaude);
    document.getElementById('pressao').textContent = patient.pressao || '-';
    displayLongText('ausculta', patient.ausculta);
    
    // Observações
    displayLongText('observacoes', patient.observacoes);
    
    // Informações do Sistema
    document.getElementById('dataCriacao').textContent = formatDateSafe(patient.dataCriacao);
    document.getElementById('dataUltimaAtualizacao').textContent = formatDateSafe(patient.dataUltimaAtualizacao);
}

function displayLongText(elementId, text) {
    const element = document.getElementById(elementId);
    
    if (!text || text.trim() === '') {
        element.textContent = '-';
    } else {
        // Preserve line breaks and format text nicely
        element.innerHTML = text.replace(/\n/g, '<br>');
    }
}

function setupEventListeners() {
    // Edit button
    document.getElementById('editBtn').addEventListener('click', function() {
        if (currentPatient) {
            window.location.href = `editar-paciente.html?id=${currentPatient.id}`;
        }
    });
    
    // Delete button
    document.getElementById('deleteBtn').addEventListener('click', function() {
        if (currentPatient) {
            confirmDelete();
        }
    });
    
    // Print button
    document.getElementById('printBtn').addEventListener('click', function() {
        window.print();
    });
}

async function confirmDelete() {
    if (!currentPatient) return;
    
    const confirmed = await Utils.showConfirmDialog(
        `Tem certeza que deseja excluir o paciente "${currentPatient.nome}"?<br><br>
         <strong class="text-danger">Esta ação não pode ser desfeita.</strong>`,
        'Confirmar Exclusão'
    );
    
    if (confirmed) {
        await deletePatient();
    }
}

async function deletePatient() {
    try {
        // Utils.showLoading(); // Comentado temporariamente
        
        await apiService.deletePaciente(currentPatient.id);
        
        Utils.showToast('Paciente excluído com sucesso', 'success');
        
        // Redirect to patients list after a short delay
        setTimeout(() => {
            window.location.href = 'pacientes.html';
        }, 1500);
        
    } catch (error) {
        console.error('Error deleting patient:', error);
        
        let errorMessage = 'Erro ao excluir paciente';
        
        if (error.message.includes('404')) {
            errorMessage = 'Paciente não encontrado';
        } else if (error.message.includes('500')) {
            errorMessage = 'Erro interno do servidor';
        }
        
        Utils.showToast(errorMessage, 'danger');
    } finally {
        // Utils.hideLoading(); // Comentado temporariamente
    }
}

function showLoadingState() {
    console.log('Mostrando estado de carregamento');
    
    // Verifica se os elementos existem
    const loadingElement = document.getElementById('loadingState');
    const detailsElement = document.getElementById('patientDetails');
    const errorElement = document.getElementById('errorState');
    
    if (!loadingElement) {
        console.error('Elemento #loadingState não encontrado!');
    } else {
        loadingElement.style.display = 'block';
    }
    
    if (!detailsElement) {
        console.error('Elemento #patientDetails não encontrado!');
    } else {
        detailsElement.style.display = 'none';
    }
    
    if (!errorElement) {
        console.error('Elemento #errorState não encontrado!');
    } else {
        errorElement.style.display = 'none';
    }
    
    // Hide action buttons
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const printBtn = document.getElementById('printBtn');
    
    if (editBtn) editBtn.style.display = 'none';
    if (deleteBtn) deleteBtn.style.display = 'none';
    if (printBtn) printBtn.style.display = 'none';
}

function showPatientDetails() {
    console.log('Mostrando detalhes do paciente');
    
    // Verifica se os elementos existem
    const loadingElement = document.getElementById('loadingState');
    const detailsElement = document.getElementById('patientDetails');
    const errorElement = document.getElementById('errorState');
    
    if (!loadingElement) {
        console.error('Elemento #loadingState não encontrado!');
    } else {
        loadingElement.style.display = 'none';
    }
    
    if (!detailsElement) {
        console.error('Elemento #patientDetails não encontrado!');
    } else {
        detailsElement.style.display = 'block';
        // Add fade-in animation
        detailsElement.classList.add('fade-in');
    }
    
    if (!errorElement) {
        console.error('Elemento #errorState não encontrado!');
    } else {
        errorElement.style.display = 'none';
    }
    
    // Show action buttons
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const printBtn = document.getElementById('printBtn');
    
    if (editBtn) editBtn.style.display = 'inline-block';
    if (deleteBtn) deleteBtn.style.display = 'inline-block';
    if (printBtn) printBtn.style.display = 'inline-block';
}

function showError(message) {
    console.log('Mostrando erro:', message);
    
    // Verifica se os elementos existem
    const loadingElement = document.getElementById('loadingState');
    const detailsElement = document.getElementById('patientDetails');
    const errorElement = document.getElementById('errorState');
    const errorMessageElement = document.getElementById('errorMessage');
    
    if (!loadingElement) {
        console.error('Elemento #loadingState não encontrado!');
    } else {
        loadingElement.style.display = 'none';
    }
    
    if (!detailsElement) {
        console.error('Elemento #patientDetails não encontrado!');
    } else {
        detailsElement.style.display = 'none';
    }
    
    if (!errorElement) {
        console.error('Elemento #errorState não encontrado!');
        // Se não encontrar o elemento de erro, criar um elemento temporário para mostrar a mensagem
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML += `
                <div class="alert alert-danger">
                    <h4>Erro ao carregar paciente</h4>
                    <p>${message}</p>
                    <a href="pacientes.html" class="btn btn-secondary">Voltar à Lista</a>
                </div>
            `;
        }
    } else {
        errorElement.style.display = 'block';
    }
    
    // Definir mensagem de erro
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
    } else {
        console.error('Elemento #errorMessage não encontrado!');
    }
    
    // Hide action buttons
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const printBtn = document.getElementById('printBtn');
    
    if (editBtn) editBtn.style.display = 'none';
    if (deleteBtn) deleteBtn.style.display = 'none';
    if (printBtn) printBtn.style.display = 'none';
}

// Global function for retry button
window.loadPatientData = function() {
    console.log('Retry button clicked');
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    
    if (patientId) {
        console.log('Retrying with patientId:', patientId);
        loadPatientData(patientId);
    } else {
        console.error('No patient ID found in URL parameters');
        showError('ID do paciente não encontrado');
    }
};

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl + E or Cmd + E = Edit
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        if (currentPatient) {
            document.getElementById('editBtn').click();
        }
    }
    
    // Ctrl + P or Cmd + P = Print (browser default, but we'll add our custom handling)
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        // Let browser handle the print
    }
    
    // ESC = Go back
    if (event.key === 'Escape') {
        window.location.href = 'pacientes.html';
    }
});

// Add social sharing functionality (optional)
function sharePatientInfo() {
    if (currentPatient && navigator.share) {
        navigator.share({
            title: `Prontuário - ${currentPatient.nome}`,
            text: `Informações do paciente ${currentPatient.nome}`,
            url: window.location.href
        }).catch(console.error);
    }
}

// Add export functionality (optional)
function exportPatientData() {
    if (!currentPatient) return;
    
    const data = {
        ...currentPatient,
        dataNascimento: Utils.formatDate(currentPatient.dataNascimento),
        dataCriacao: Utils.formatDate(currentPatient.dataCriacao),
        dataUltimaAtualizacao: Utils.formatDate(currentPatient.dataUltimaAtualizacao)
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `prontuario-${currentPatient.nome.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}