// Patients list functionality
let allPatients = [];
let filteredPatients = [];
let currentPage = 1;
const patientsPerPage = 10;
let deletePatientId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializePatientsPage();
});

async function initializePatientsPage() {
    try {
        // Check if there's a search parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        
        if (searchTerm) {
            document.getElementById('searchInput').value = searchTerm;
        }
        
        await loadPatients();
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing patients page:', error);
        showError('Erro ao carregar a página de pacientes');
    }
}

async function loadPatients() {
    try {
        console.log('Starting to load patients...');
        mostrarLoading();
        
        console.log('Loading all patients...');
        allPatients = await apiService.getPacientes();
        
        console.log('Patients loaded successfully:', allPatients.length);
        console.log('Sample patient data:', allPatients[0]);
        
        console.log('Applying filters and sort...');
        applyFiltersAndSort();
        
        console.log('Displaying patients...');
        displayPatients();
        
        console.log('Updating results summary...');
        updateResultsSummary();
        
        console.log('Patients display completed');
        
    } catch (error) {
        console.error('Error loading patients:', error);
        mostrarErro(`Erro ao carregar pacientes: ${error.message}`);
    }
}

function applyFiltersAndSort() {
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    // Copy array to avoid modifying original
    filteredPatients = [...allPatients];
    
    // Apply local search filter (case-insensitive)
    if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remove accents for better matching
        
        filteredPatients = filteredPatients.filter(patient => {
            // Search in name (removing accents for better matching)
            const nomeLower = patient.nome.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            
            // Search in address (removing accents for better matching)
            const enderecoLower = (patient.endereco || '').toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            
            return nomeLower.includes(searchTermLower) || 
                   enderecoLower.includes(searchTermLower);
        });
    }
    
    // Sort patients
    filteredPatients.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
            case 'nome':
                aValue = a.nome.toLowerCase();
                bValue = b.nome.toLowerCase();
                break;
            case 'dataCriacao':
                aValue = new Date(a.dataCriacao);
                bValue = new Date(b.dataCriacao);
                break;
            case 'idade':
                aValue = a.idade;
                bValue = b.idade;
                break;
            default:
                aValue = a.nome.toLowerCase();
                bValue = b.nome.toLowerCase();
        }
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Reset to first page when filtering/sorting
    currentPage = 1;
}

function displayPatients() {
    try {
        console.log('Starting to display patients...', filteredPatients.length);
        const container = document.getElementById('patientsTable');
        
        if (filteredPatients.length === 0) {
            console.log('No patients to display');
            mostrarSemPacientes();
            document.getElementById('paginationNav').innerHTML = '';
            return;
        }

        mostrarLista();
        
        console.log('Calculating pagination...');
        // Calculate pagination
        const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
        const startIndex = (currentPage - 1) * patientsPerPage;
        const endIndex = startIndex + patientsPerPage;
        const patientsToShow = filteredPatients.slice(startIndex, endIndex);
        
        console.log('Patients to show:', patientsToShow);
        console.log('Building table HTML...');
        
        // Build HTML step by step
        let tableHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Nome</th>
                            <th>Idade</th>
                            <th>Data de Nascimento</th>
                            <th>Endereço</th>
                            <th>Cadastrado em</th>
                            <th width="150">Ações</th>
                        </tr>
                    </thead>
                    <tbody>`;
        
        console.log('Processing each patient...');
        for (let i = 0; i < patientsToShow.length; i++) {
            const paciente = patientsToShow[i];
            console.log(`Processing patient ${i + 1}:`, paciente.nome);
            
            let enderecoCompleto = '';
            try {
                enderecoCompleto = formatEnderecoCompleto(paciente);
                console.log(`Address formatted for ${paciente.nome}:`, enderecoCompleto);
            } catch (error) {
                console.error(`Error formatting address for ${paciente.nome}:`, error);
                enderecoCompleto = 'Endereço não disponível';
            }
            
            tableHTML += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <i class="fas fa-user text-primary me-2"></i>
                            <div>
                                <div class="fw-semibold">${paciente.nome}</div>
                                <small class="text-muted">ID: ${paciente.id}</small>
                            </div>
                        </div>
                    </td>
                    <td>${paciente.idade} anos</td>
                    <td>${Utils.formatDate(paciente.dataNascimento)}</td>
                    <td>
                        <span title="${enderecoCompleto}">
                            ${Utils.truncateText(enderecoCompleto, 30)}
                        </span>
                    </td>
                    <td>
                        <small class="text-muted">
                            ${Utils.formatDate(paciente.dataCriacao)}
                        </small>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <a href="detalhes-paciente-simples.html?id=${paciente.id}" 
                               class="btn btn-outline-primary btn-sm" 
                               title="Visualizar">
                                <i class="fas fa-eye"></i>
                            </a>
                            <a href="editar-paciente-simples.html?id=${paciente.id}" 
                               class="btn btn-outline-secondary btn-sm" 
                               title="Editar">
                                <i class="fas fa-edit"></i>
                            </a>
                            <a href="criar-prontuario.html?pacienteId=${paciente.id}" 
                               class="btn btn-outline-success btn-sm" 
                               title="Criar prontuário">
                                <i class="fas fa-file-medical"></i>
                            </a>
                            <button class="btn btn-outline-danger btn-sm" 
                                    onclick="confirmDelete(${paciente.id}, '${paciente.nome.replace(/'/g, "\\'")}')"
                                    title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        }
        
        tableHTML += `
                    </tbody>
                </table>
            </div>`;
        
        console.log('Setting innerHTML...');
        container.innerHTML = tableHTML;
        
        console.log('Generating pagination...');
        generatePagination(totalPages);
        
        console.log('Adding fade-in animation...');
        container.classList.add('fade-in');
        
        console.log('displayPatients completed successfully');
        
    } catch (error) {
        console.error('Error in displayPatients:', error);
        const container = document.getElementById('patientsTable');
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                Erro ao carregar a lista de pacientes: ${error.message}
            </div>`;
    } finally {
        // Hide loading spinner
        // const loadingDiv = document.getElementById('loading');
        // if (loadingDiv) {
        //     loadingDiv.style.display = 'none';
        // }
        console.log('displayPatients finally block executed');
    }
}

function generatePagination(totalPages) {
    const paginationNav = document.getElementById('paginationNav');
    
    if (totalPages <= 1) {
        paginationNav.innerHTML = '';
        return;
    }
    
    let paginationHtml = '<ul class="pagination justify-content-center">';
    
    // Previous button
    paginationHtml += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
        paginationHtml += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(1)">1</a>
            </li>
        `;
        if (startPage > 2) {
            paginationHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
        paginationHtml += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHtml += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationHtml += '</ul>';
    paginationNav.innerHTML = paginationHtml;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayPatients();
        
        // Scroll to top of table
        document.getElementById('patientsTable').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function updateResultsSummary() {
    const summary = document.getElementById('resultsSummary');
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    let text = `Mostrando ${filteredPatients.length} paciente(s)`;
    
    if (searchTerm) {
        text += ` para "${searchTerm}"`;
    }
    
    if (filteredPatients.length !== allPatients.length) {
        text += ` de ${allPatients.length} total`;
    }
    
    summary.textContent = text;
}

function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    const debouncedSearch = Utils.debounce(loadPatients, 500);
    
    searchInput.addEventListener('input', debouncedSearch);
    
    // Clear search
    document.getElementById('clearSearch').addEventListener('click', () => {
        searchInput.value = '';
        loadPatients();
        
        // Update URL to remove search parameter
        const url = new URL(window.location);
        url.searchParams.delete('search');
        window.history.replaceState({}, '', url);
    });
    
    // Sort controls
    document.getElementById('sortBy').addEventListener('change', () => {
        applyFiltersAndSort();
        displayPatients();
        updateResultsSummary();
    });
    
    document.getElementById('sortOrder').addEventListener('change', () => {
        applyFiltersAndSort();
        displayPatients();
        updateResultsSummary();
    });
    
    // Delete confirmation
    document.getElementById('confirmDelete').addEventListener('click', handleDelete);
}

function confirmDelete(patientId, patientName) {
    deletePatientId = patientId;
    document.getElementById('deletePatientName').textContent = patientName;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

async function handleDelete() {
    if (!deletePatientId) return;
    
    try {
        Utils.showLoading();
        
        // Verificar se o paciente possui prontuários
        console.log('Verificando prontuários do paciente:', deletePatientId);
        const response = await fetch(`https://eprontuario-e6ftdrftcdaqbycy.b02.azurefd.net/api/prontuarios/paciente/${deletePatientId}`);
        
        if (!response.ok) {
            throw new Error('Erro ao verificar prontuários do paciente');
        }
        
        const prontuarios = await response.json();
        console.log('Prontuários encontrados:', prontuarios.length);
        
        if (prontuarios.length > 0) {
            Utils.hideLoading();
            const patientName = document.getElementById('deletePatientName').textContent;
            Utils.showToast(`Não é possível excluir o paciente "${patientName}" pois existem ${prontuarios.length} prontuário${prontuarios.length !== 1 ? 's' : ''} cadastrado${prontuarios.length !== 1 ? 's' : ''} para este paciente.`, 'warning');
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();
            deletePatientId = null;
            return;
        }
        
        await apiService.deletePaciente(deletePatientId);
        
        Utils.showToast('Paciente excluído com sucesso', 'success');
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        // Reload patients list
        await loadPatients();
        
    } catch (error) {
        console.error('Error deleting patient:', error);
        Utils.showToast('Erro ao excluir paciente', 'danger');
    } finally {
        Utils.hideLoading();
        deletePatientId = null;
    }
}

function showError(message) {
    const container = document.getElementById('patientsTable');
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle"></i>
            ${message}
            <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="loadPatients()">
                <i class="bi bi-arrow-clockwise"></i> Tentar novamente
            </button>
        </div>
    `;
}

// Helper function to format address safely
function formatEnderecoCompleto(paciente) {
    try {
        // Try to use AddressUtils if available
        if (typeof AddressUtils !== 'undefined' && AddressUtils.formatEnderecoCompleto) {
            return AddressUtils.formatEnderecoCompleto(
                paciente.rua, 
                paciente.numero, 
                paciente.complemento, 
                paciente.bairro, 
                paciente.cidade, 
                paciente.estado
            );
        }
        
        // Fallback formatting
        let endereco = '';
        if (paciente.rua) endereco += paciente.rua;
        if (paciente.numero) endereco += `, ${paciente.numero}`;
        if (paciente.complemento) endereco += `, ${paciente.complemento}`;
        if (paciente.bairro) endereco += ` - ${paciente.bairro}`;
        if (paciente.cidade) endereco += ` - ${paciente.cidade}`;
        if (paciente.estado) endereco += `/${paciente.estado}`;
        
        return endereco || 'Endereço não informado';
    } catch (error) {
        console.error('Error formatting address:', error);
        return 'Erro ao formatar endereço';
    }
}

// Global functions for onclick handlers
window.changePage = changePage;
window.confirmDelete = confirmDelete;

// Funções para controlar exibição de loading, erro e lista
function mostrarLoading() {
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('erro').classList.add('d-none');
    document.getElementById('listaPacientes').classList.add('d-none');
    document.getElementById('semPacientes').classList.add('d-none');
}

function esconderLoading() {
    document.getElementById('loading').classList.add('d-none');
}

function mostrarErro(mensagem) {
    esconderLoading();
    document.getElementById('mensagemErro').textContent = mensagem;
    document.getElementById('erro').classList.remove('d-none');
    document.getElementById('listaPacientes').classList.add('d-none');
    document.getElementById('semPacientes').classList.add('d-none');
}

function mostrarLista() {
    esconderLoading();
    document.getElementById('erro').classList.add('d-none');
    document.getElementById('listaPacientes').classList.remove('d-none');
    document.getElementById('semPacientes').classList.add('d-none');
}

function mostrarSemPacientes() {
    esconderLoading();
    document.getElementById('erro').classList.add('d-none');
    document.getElementById('listaPacientes').classList.add('d-none');
    document.getElementById('semPacientes').classList.remove('d-none');
}