// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

async function initializeDashboard() {
    try {
        // Load statistics
        await loadStatistics();
        
        // Load recent patients
        await loadRecentPatients();
        
        // Setup search functionality
        setupSearch();
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        Utils.showToast('Erro ao carregar dados do dashboard', 'danger');
    }
}

async function loadStatistics() {
    try {
        const pacientes = await apiService.getPacientes();
        
        // Total patients
        document.getElementById('totalPacientes').textContent = pacientes.length;
        
        // Patients created today
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const novosHoje = pacientes.filter(p => {
            const createdDate = new Date(p.dataCriacao).toISOString().split('T')[0];
            return createdDate === todayString;
        }).length;
        document.getElementById('novosHoje').textContent = novosHoje;
        
        // Patients created this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const novosEstaSemana = pacientes.filter(p => {
            const createdDate = new Date(p.dataCriacao);
            return createdDate >= oneWeekAgo;
        }).length;
        document.getElementById('novosEstaSemana').textContent = novosEstaSemana;
        
        // Patients created this month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const novosEsteMes = pacientes.filter(p => {
            const createdDate = new Date(p.dataCriacao);
            return createdDate >= oneMonthAgo;
        }).length;
        document.getElementById('novosEsteMes').textContent = novosEsteMes;
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Set default values on error
        document.getElementById('totalPacientes').textContent = '0';
        document.getElementById('novosHoje').textContent = '0';
        document.getElementById('novosEstaSemana').textContent = '0';
        document.getElementById('novosEsteMes').textContent = '0';
    }
}

async function loadRecentPatients() {
    try {
        const pacientes = await apiService.getPacientes();
        
        // Get the 5 most recent patients
        const recentPatients = pacientes
            .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
            .slice(0, 5);
        
        const container = document.getElementById('recentPatients');
        
        if (recentPatients.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-inbox display-4 text-muted mb-3"></i>
                    <h5 class="text-muted">Nenhum paciente cadastrado</h5>
                    <p class="text-muted">Comece cadastrando o primeiro paciente.</p>
                    <a href="novo-paciente.html" class="btn btn-primary">
                        <i class="bi bi-person-plus"></i> Cadastrar Paciente
                    </a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>Data de Nascimento</th>
                        <th>Cadastrado em</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentPatients.map(paciente => `
                        <tr>
                            <td>
                                <strong>${paciente.nome}</strong>
                            </td>
                            <td>${paciente.idade} anos</td>
                            <td>${Utils.formatDate(paciente.dataNascimento)}</td>
                            <td>
                                <small class="text-muted">
                                    ${Utils.formatDate(paciente.dataCriacao)}
                                </small>
                            </td>
                            <td>
                                <div class="btn-group btn-group-sm">
                                    <a href="detalhes-paciente.html?id=${paciente.id}" 
                                       class="btn btn-outline-primary btn-action" 
                                       title="Ver detalhes">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    <a href="editar-paciente.html?id=${paciente.id}" 
                                       class="btn btn-outline-warning btn-action" 
                                       title="Editar">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // Add fade-in animation
        container.classList.add('fade-in');
        
    } catch (error) {
        console.error('Error loading recent patients:', error);
        document.getElementById('recentPatients').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle"></i>
                Erro ao carregar pacientes recentes. Tente recarregar a página.
            </div>
        `;
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (!searchInput || !searchButton) return;
    
    // Debounced search function
    const debouncedSearch = Utils.debounce(async (term) => {
        if (term.trim().length >= 2) {
            try {
                const results = await apiService.searchPacientes(term);
                
                if (results.length > 0) {
                    // Redirect to patients page with search term
                    window.location.href = `pacientes.html?search=${encodeURIComponent(term)}`;
                } else {
                    Utils.showToast('Nenhum paciente encontrado', 'info');
                }
            } catch (error) {
                console.error('Search error:', error);
                Utils.showToast('Erro na pesquisa', 'danger');
            }
        }
    }, 500);
    
    // Search on input
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value;
        if (term.trim().length >= 2) {
            debouncedSearch(term);
        }
    });
    
    // Search on button click
    searchButton.addEventListener('click', () => {
        const term = searchInput.value.trim();
        if (term.length >= 2) {
            window.location.href = `pacientes.html?search=${encodeURIComponent(term)}`;
        } else if (term.length === 0) {
            window.location.href = 'pacientes.html';
        } else {
            Utils.showToast('Digite pelo menos 2 caracteres para pesquisar', 'warning');
        }
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchButton.click();
        }
    });
}

// Auto-refresh statistics every 30 seconds
setInterval(async () => {
    try {
        await loadStatistics();
    } catch (error) {
        console.error('Error auto-refreshing statistics:', error);
    }
}, 30000);

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add click effect to statistic cards
    const statisticCards = document.querySelectorAll('.card.bg-primary, .card.bg-success, .card.bg-info, .card.bg-warning');
    
    statisticCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.add('success-animation');
            setTimeout(() => {
                this.classList.remove('success-animation');
            }, 600);
        });
        
        // Add cursor pointer
        card.style.cursor = 'pointer';
    });
});