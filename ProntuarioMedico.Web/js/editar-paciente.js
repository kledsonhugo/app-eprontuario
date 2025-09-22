// Edit patient functionality
let currentPatient = null;
let originalData = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeEditPatientForm();
});

function initializeEditPatientForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    
    if (!patientId) {
        showError('ID do paciente não fornecido');
        return;
    }
    
    loadPatientData(patientId);
    setupFormValidation();
    setupAddressFields();
    setupFormSubmission();
    setupBackButton(patientId);
}

async function loadPatientData(patientId) {
    try {
        console.log('Loading patient data for editing, ID:', patientId);
        
        // Simpler loading state
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = '<div class="text-center"><h3>Carregando dados do paciente para edição...</h3></div>';
        }
        
        console.log('Calling API to get patient...');
        const patient = await apiService.getPaciente(patientId);
        console.log('Patient data received:', patient);
        
        currentPatient = patient;
        originalData = { ...patient }; // Keep a copy of original data
        
        console.log('Creating edit form...');
        
        // Create a simple edit form
        if (container) {
            container.innerHTML = `
                <div class="row">
                    <div class="col-12">
                        <h2>Editar Paciente: ${patient.nome}</h2>
                        <div class="card">
                            <div class="card-body">
                                <form id="editForm">
                                    <div class="mb-3">
                                        <label class="form-label">Nome</label>
                                        <input type="text" class="form-control" value="${patient.nome}" id="nome">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Idade</label>
                                        <input type="number" class="form-control" value="${patient.idade}" id="idade">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Rua</label>
                                        <input type="text" class="form-control" value="${patient.rua || ''}" id="rua">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Número</label>
                                        <input type="text" class="form-control" value="${patient.numero || ''}" id="numero">
                                    </div>
                                    <div class="mt-3">
                                        <a href="detalhes-paciente.html?id=${patient.id}" class="btn btn-secondary">Cancelar</a>
                                        <button type="button" class="btn btn-primary" onclick="savePatient()">Salvar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        console.log('Patient data loaded for editing successfully');
        
    } catch (error) {
        console.error('Error loading patient data:', error);
        
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Erro ao carregar paciente para edição</h4>
                    <p>${error.message}</p>
                    <a href="pacientes.html" class="btn btn-secondary">Voltar à Lista</a>
                </div>
            `;
        }
    }
}

function populateForm(patient) {
    // Hidden ID field
    document.getElementById('patientId').value = patient.id;
    
    // Personal data
    document.getElementById('nome').value = patient.nome || '';
    document.getElementById('idade').value = patient.idade || '';
    document.getElementById('dataNascimento').value = Utils.formatDateForInput(patient.dataNascimento) || '';
    
    // Address fields
    document.getElementById('rua').value = patient.rua || '';
    document.getElementById('numero').value = patient.numero || '';
    document.getElementById('complemento').value = patient.complemento || '';
    document.getElementById('bairro').value = patient.bairro || '';
    
    // Setup address dropdowns after populating basic fields
    populateAddressDropdowns(patient.estado, patient.cidade);
    
    // Activity information
    document.getElementById('frequenciaAtividade').value = patient.frequenciaAtividade || '';
    document.getElementById('tempoAtividade').value = patient.tempoAtividade || '';
    document.getElementById('locaisPraticaAtividade').value = patient.locaisPraticaAtividade || '';
    document.getElementById('comoSoubeProjeto').value = patient.comoSoubeProjeto || '';
    document.getElementById('tipoDeslocamento').value = patient.tipoDeslocamento || '';
    document.getElementById('opiniaoHorarioAplicacao').value = patient.opiniaoHorarioAplicacao || '';
    
    // Medical information
    document.getElementById('historicoMedico').value = patient.historicoMedico || '';
    document.getElementById('evolucaoSaude').value = patient.evolucaoSaude || '';
    document.getElementById('pressao').value = patient.pressao || '';
    document.getElementById('ausculta').value = patient.ausculta || '';
    
    // Observations
    document.getElementById('observacoes').value = patient.observacoes || '';
}

function setupAddressFields() {
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');
    
    // Initialize estado dropdown
    AddressUtils.populateEstadoSelect(estadoSelect);
    
    // Handle estado selection change
    estadoSelect.addEventListener('change', function() {
        const selectedEstado = this.value;
        
        // Reset and populate cidade dropdown
        cidadeSelect.value = '';
        AddressUtils.populateCidadeSelect(cidadeSelect, selectedEstado);
        
        // Validate both fields
        validateField(estadoSelect);
        if (selectedEstado) {
            cidadeSelect.classList.remove('is-valid', 'is-invalid');
        }
    });
    
    // Handle cidade selection change
    cidadeSelect.addEventListener('change', function() {
        validateField(cidadeSelect);
    });
}

function populateAddressDropdowns(estadoValue, cidadeValue) {
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');
    
    // Set estado value
    if (estadoValue) {
        estadoSelect.value = estadoValue;
        
        // Populate and set cidade
        AddressUtils.populateCidadeSelect(cidadeSelect, estadoValue, cidadeValue);
    }
}

function setupFormValidation() {
    const form = document.getElementById('patientForm');
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
    
    // Setup date and age validation
    setupDateValidation();
    setupAgeCalculation();
}

function validateField(field) {
    const isValid = field.checkValidity();
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

function setupDateValidation() {
    const dateInput = document.getElementById('dataNascimento');
    const ageInput = document.getElementById('idade');
    
    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', today);
    
    // Validate date is not in the future
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        
        if (selectedDate > today) {
            this.setCustomValidity('A data de nascimento não pode ser no futuro');
            this.classList.add('is-invalid');
        } else {
            this.setCustomValidity('');
            validateField(this);
            
            // Auto-calculate age when date changes
            if (this.value) {
                const calculatedAge = Utils.calculateAge(this.value);
                ageInput.value = calculatedAge;
                validateField(ageInput);
            }
        }
    });
}

function setupAgeCalculation() {
    const ageInput = document.getElementById('idade');
    const dateInput = document.getElementById('dataNascimento');
    
    // When age is manually changed, try to estimate birth date if not already set
    ageInput.addEventListener('change', function() {
        const age = parseInt(this.value);
        
        if (age >= 0 && age <= 150 && !dateInput.value) {
            const currentYear = new Date().getFullYear();
            const estimatedBirthYear = currentYear - age;
            const estimatedDate = `${estimatedBirthYear}-01-01`;
            dateInput.value = estimatedDate;
            validateField(dateInput);
        }
    });
}

function setupFormSubmission() {
    const form = document.getElementById('patientForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Validate form
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            
            // Focus on first invalid field
            const firstInvalid = form.querySelector('.form-control:invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            Utils.showToast('Por favor, corrija os campos obrigatórios em destaque', 'warning');
            return;
        }
        
        await submitForm();
    });
}

function setupBackButton(patientId) {
    const backBtn = document.getElementById('backBtn');
    backBtn.style.display = 'inline-block';
    backBtn.addEventListener('click', function() {
        checkForUnsavedChanges().then(canLeave => {
            if (canLeave) {
                window.location.href = `detalhes-paciente.html?id=${patientId}`;
            }
        });
    });
}

async function submitForm() {
    try {
        // Utils.showLoading(); // Comentado temporariamente
        
        // Disable submit button to prevent double submission
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Salvando...';
        
        // Collect form data
        const formData = collectFormData();
        
        // Validate data before sending
        const validationResult = validateFormData(formData);
        if (!validationResult.isValid) {
            throw new Error(validationResult.message);
        }
        
        // Submit to API
        await apiService.updatePaciente(currentPatient.id, formData);
        
        Utils.showToast('Paciente atualizado com sucesso!', 'success');
        
        // Update original data to prevent unsaved changes warning
        originalData = { ...formData };
        
        // Redirect to patient details page
        setTimeout(() => {
            window.location.href = `detalhes-paciente.html?id=${currentPatient.id}`;
        }, 1500);
        
    } catch (error) {
        console.error('Error updating patient:', error);
        
        let errorMessage = 'Erro ao atualizar paciente. Tente novamente.';
        
        if (error.message.includes('400')) {
            errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
        } else if (error.message.includes('404')) {
            errorMessage = 'Paciente não encontrado.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (error.message.includes('fetch')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }
        
        Utils.showToast(errorMessage, 'danger');
        
        // Re-enable submit button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Salvar Alterações';
        
    } finally {
        // Utils.hideLoading(); // Comentado temporariamente
    }
}

function collectFormData() {
    const form = document.getElementById('patientForm');
    const formData = new FormData(form);
    
    const data = {};
    
    // Required fields
    data.id = parseInt(formData.get('id'));
    data.nome = formData.get('nome')?.trim() || '';
    data.idade = parseInt(formData.get('idade')) || 0;
    data.dataNascimento = formData.get('dataNascimento') || '';
    
    // Address fields
    data.rua = formData.get('rua')?.trim() || '';
    data.numero = formData.get('numero')?.trim() || '';
    data.complemento = formData.get('complemento')?.trim() || '';
    data.bairro = formData.get('bairro')?.trim() || '';
    data.cidade = formData.get('cidade')?.trim() || '';
    data.estado = formData.get('estado')?.trim() || '';
    
    // Optional fields
    data.frequenciaAtividade = formData.get('frequenciaAtividade')?.trim() || '';
    data.tempoAtividade = formData.get('tempoAtividade')?.trim() || '';
    data.locaisPraticaAtividade = formData.get('locaisPraticaAtividade')?.trim() || '';
    data.comoSoubeProjeto = formData.get('comoSoubeProjeto')?.trim() || '';
    data.tipoDeslocamento = formData.get('tipoDeslocamento')?.trim() || '';
    data.opiniaoHorarioAplicacao = formData.get('opiniaoHorarioAplicacao')?.trim() || '';
    data.historicoMedico = formData.get('historicoMedico')?.trim() || '';
    data.evolucaoSaude = formData.get('evolucaoSaude')?.trim() || '';
    data.pressao = formData.get('pressao')?.trim() || '';
    data.ausculta = formData.get('ausculta')?.trim() || '';
    data.observacoes = formData.get('observacoes')?.trim() || '';
    
    return data;
}

function validateFormData(data) {
    // Validate required fields
    if (!data.nome) {
        return { isValid: false, message: 'Nome é obrigatório' };
    }
    
    if (!data.idade || data.idade < 0 || data.idade > 150) {
        return { isValid: false, message: 'Idade deve estar entre 0 e 150 anos' };
    }
    
    if (!data.dataNascimento) {
        return { isValid: false, message: 'Data de nascimento é obrigatória' };
    }
    
    if (!data.rua) {
        return { isValid: false, message: 'Rua/Avenida é obrigatória' };
    }
    
    if (!data.numero) {
        return { isValid: false, message: 'Número é obrigatório' };
    }
    
    if (!data.bairro) {
        return { isValid: false, message: 'Bairro é obrigatório' };
    }
    
    if (!data.estado) {
        return { isValid: false, message: 'Estado é obrigatório' };
    }
    
    if (!data.cidade) {
        return { isValid: false, message: 'Cidade é obrigatória' };
    }
    
    // Validate date
    const birthDate = new Date(data.dataNascimento);
    const today = new Date();
    
    if (birthDate > today) {
        return { isValid: false, message: 'Data de nascimento não pode ser no futuro' };
    }
    
    // Validate age consistency with birth date
    const calculatedAge = Utils.calculateAge(data.dataNascimento);
    if (Math.abs(calculatedAge - data.idade) > 1) {
        return { isValid: false, message: 'Idade não confere com a data de nascimento' };
    }
    
    // Validate field lengths
    if (data.nome.length > 100) {
        return { isValid: false, message: 'Nome deve ter no máximo 100 caracteres' };
    }
    
    if (data.rua.length > 100) {
        return { isValid: false, message: 'Rua/Avenida deve ter no máximo 100 caracteres' };
    }
    
    if (data.numero.length > 20) {
        return { isValid: false, message: 'Número deve ter no máximo 20 caracteres' };
    }
    
    if (data.complemento.length > 50) {
        return { isValid: false, message: 'Complemento deve ter no máximo 50 caracteres' };
    }
    
    if (data.bairro.length > 50) {
        return { isValid: false, message: 'Bairro deve ter no máximo 50 caracteres' };
    }
    
    if (data.cidade.length > 50) {
        return { isValid: false, message: 'Cidade deve ter no máximo 50 caracteres' };
    }
    
    if (data.estado.length > 2) {
        return { isValid: false, message: 'Estado deve ter no máximo 2 caracteres' };
    }
    
    return { isValid: true };
}

function resetForm() {
    Utils.showConfirmDialog(
        'Tem certeza que deseja restaurar os dados originais do formulário?',
        'Confirmar Restauração'
    ).then(confirmed => {
        if (confirmed) {
            populateForm(originalData);
            
            // Remove validation classes
            const form = document.getElementById('patientForm');
            form.classList.remove('was-validated');
            Utils.clearFormValidation(form);
            
            Utils.showToast('Dados restaurados com sucesso', 'info');
        }
    });
}

async function confirmCancel() {
    const hasUnsavedChanges = await checkForUnsavedChanges();
    
    if (!hasUnsavedChanges) {
        window.location.href = `detalhes-paciente.html?id=${currentPatient.id}`;
        return;
    }
    
    const confirmed = await Utils.showConfirmDialog(
        'Você tem alterações não salvas. Tem certeza que deseja cancelar?',
        'Cancelar Edição'
    );
    
    if (confirmed) {
        window.location.href = `detalhes-paciente.html?id=${currentPatient.id}`;
    }
}

async function checkForUnsavedChanges() {
    if (!originalData) return false;
    
    const currentFormData = collectFormData();
    
    // Compare current data with original data
    for (const key in originalData) {
        if (originalData[key] !== currentFormData[key]) {
            return true;
        }
    }
    
    return false;
}

function showLoadingState() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('patientForm').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
}

function showForm() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('patientForm').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    
    // Add fade-in animation
    document.getElementById('patientForm').classList.add('fade-in');
}

function showError(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('patientForm').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    
    document.getElementById('errorMessage').textContent = message;
}

// Global functions for button onclick
window.resetForm = resetForm;
window.confirmCancel = confirmCancel;

// Simple save function for testing
async function savePatient() {
    try {
        console.log('Saving patient...');
        
        const nome = document.getElementById('nome').value;
        const idade = parseInt(document.getElementById('idade').value);
        const rua = document.getElementById('rua').value;
        const numero = document.getElementById('numero').value;
        
        const updateData = {
            ...currentPatient,
            nome,
            idade,
            rua,
            numero
        };
        
        await apiService.updatePaciente(currentPatient.id, updateData);
        
        alert('Paciente atualizado com sucesso!');
        window.location.href = `detalhes-paciente.html?id=${currentPatient.id}`;
        
    } catch (error) {
        console.error('Error saving patient:', error);
        alert('Erro ao salvar: ' + error.message);
    }
}

// Make savePatient globally available
window.savePatient = savePatient;

// Global function for retry button
window.loadPatientData = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    
    if (patientId) {
        loadPatientData(patientId);
    }
};

// Warn user about unsaved changes when leaving page
window.addEventListener('beforeunload', function(e) {
    checkForUnsavedChanges().then(hasChanges => {
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl + S or Cmd + S = Save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        document.getElementById('submitBtn').click();
    }
    
    // ESC = Cancel
    if (event.key === 'Escape') {
        confirmCancel();
    }
});