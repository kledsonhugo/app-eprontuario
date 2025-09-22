// New patient form functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNewPatientForm();
});

function initializeNewPatientForm() {
    setupFormValidation();
    setupCEPValidation();
    setupIdadeValidation();
    setupDateValidation();
    setupAgeCalculation();
    setupAddressFields();
    setupFormSubmission();
    clearPersonalDataFields(); // Garantir que dados pessoais sempre iniciem vazios
}

function clearPersonalDataFields() {
    // Lista de campos de dados pessoais que devem sempre iniciar vazios
    const personalDataFields = ['nome', 'idade', 'dataNascimento', 'cep', 'rua', 'numero', 'complemento', 'bairro'];
    
    personalDataFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.value = '';
        }
    });
    
    // Limpar selects de endereço
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');
    
    if (estadoSelect) {
        estadoSelect.selectedIndex = 0; // Primeira opção (vazia)
    }
    
    if (cidadeSelect) {
        cidadeSelect.selectedIndex = 0; // Primeira opção (vazia)
        cidadeSelect.disabled = true; // Manter desabilitado até selecionar estado
    }
}

function setupCEPValidation() {
    const cepInput = document.getElementById('cep');
    
    if (cepInput) {
        // Máscara para CEP
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            
            this.value = value;
            
            // Validação específica do CEP
            const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
            if (value.length === 9 && !cepRegex.test(value)) {
                this.setCustomValidity('CEP deve estar no formato XXXXX-XXX com apenas números');
                this.classList.add('is-invalid');
            } else if (value.length === 9 && cepRegex.test(value)) {
                this.setCustomValidity('');
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else if (value.length < 9 && value.length > 0) {
                this.setCustomValidity('CEP incompleto');
                this.classList.add('is-invalid');
            } else {
                this.setCustomValidity('');
                this.classList.remove('is-invalid', 'is-valid');
            }
        });
        
        // Validação no blur
        cepInput.addEventListener('blur', function() {
            const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
            if (this.value && !cepRegex.test(this.value)) {
                this.setCustomValidity('CEP deve estar no formato XXXXX-XXX com apenas números');
                this.classList.add('is-invalid');
            }
        });
    }
}

function setupIdadeValidation() {
    const idadeInput = document.getElementById('idade');
    
    if (idadeInput) {
        idadeInput.addEventListener('input', function() {
            const idade = parseInt(this.value);
            
            if (isNaN(idade) || idade < 0 || idade > 120) {
                this.setCustomValidity('Idade deve ser um número entre 0 e 120 anos');
                this.classList.add('is-invalid');
            } else {
                this.setCustomValidity('');
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        
        // Impedir entrada de caracteres não numéricos
        idadeInput.addEventListener('keypress', function(e) {
            if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && 
                e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && isNaN(e.key)) {
                e.preventDefault();
            }
        });
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
    
    // When age is manually changed, try to estimate birth date
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
        const result = await apiService.createPaciente(formData);
        
        Utils.showToast('Paciente cadastrado com sucesso!', 'success');
                    
                    // Aguardar um pouco antes de redirecionar
                    setTimeout(() => {
                        window.location.href = `detalhes-paciente-simples.html?id=${result.id}`;
                    }, 1500);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        
        let errorMessage = 'Erro ao cadastrar paciente. Tente novamente.';
        
        if (error.message.includes('400')) {
            errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (error.message.includes('fetch')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }
        
        Utils.showToast(errorMessage, 'danger');
        
        // Re-enable submit button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Cadastrar Paciente';
        
    } finally {
        // Utils.hideLoading(); // Comentado temporariamente
    }
}

function collectFormData() {
    const form = document.getElementById('patientForm');
    const formData = new FormData(form);
    
    const data = {};
    
    // Required fields
    data.nome = formData.get('nome')?.trim() || '';
    data.idade = parseInt(formData.get('idade')) || 0;
    data.dataNascimento = formData.get('dataNascimento') || '';
    
    // Address fields
    data.cep = formData.get('cep')?.trim() || '';
    data.rua = formData.get('rua')?.trim() || '';
    data.numero = formData.get('numero')?.trim() || '';
    data.complemento = formData.get('complemento')?.trim() || '';
    data.bairro = formData.get('bairro')?.trim() || '';
    data.cidade = formData.get('cidade')?.trim() || '';
    data.estado = formData.get('estado')?.trim() || '';
    
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
    const form = document.getElementById('patientForm');
    
    // Show confirmation dialog
    Utils.showConfirmDialog(
        'Tem certeza que deseja limpar todos os campos do formulário?',
        'Confirmar Limpeza'
    ).then(confirmed => {
        if (confirmed) {
            form.reset();
            form.classList.remove('was-validated');
            
            // Remove validation classes
            Utils.clearFormValidation(form);
            
            // Focus on first field
            document.getElementById('nome').focus();
            
            Utils.showToast('Formulário limpo com sucesso', 'info');
        }
    });
}

// Auto-save functionality (optional - saves to localStorage)
function setupAutoSave() {
    const form = document.getElementById('patientForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Load saved data on page load
    loadAutoSavedData();
    
    // Save data on input change
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            saveFormData();
        }, 1000));
    });
}

function saveFormData() {
    const data = collectFormData();
    localStorage.setItem('newPatientFormData', JSON.stringify(data));
}

function loadAutoSavedData() {
    const savedData = localStorage.getItem('newPatientFormData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Only load if it's recent (within 1 hour)
            const savedTime = localStorage.getItem('newPatientFormDataTime');
            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            
            if (savedTime && parseInt(savedTime) > oneHourAgo) {
                // Exclude personal data fields from auto-restore
                const personalDataFields = ['nome', 'idade', 'dataNascimento', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado'];
                const filteredData = { ...data };
                
                // Remove personal data fields
                personalDataFields.forEach(field => {
                    delete filteredData[field];
                });
                
                // Only populate non-personal data fields
                populateForm(filteredData);
                
                // Show toast only if there was actually data to restore
                const hasDataToRestore = Object.keys(filteredData).some(key => filteredData[key]);
                if (hasDataToRestore) {
                    Utils.showToast('Dados das seções de atividade física e médicas foram restaurados', 'info');
                }
            }
        } catch (error) {
            console.error('Error loading auto-saved data:', error);
        }
    }
}

function populateForm(data) {
    Object.keys(data).forEach(key => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field && data[key]) {
            field.value = data[key];
        }
    });
}

function clearAutoSavedData() {
    localStorage.removeItem('newPatientFormData');
    localStorage.removeItem('newPatientFormDataTime');
}

// Global function for button onclick
window.resetForm = resetForm;

// Initialize auto-save on page load
document.addEventListener('DOMContentLoaded', function() {
    setupAutoSave();
    
    // Clear auto-saved data when form is successfully submitted
    window.addEventListener('beforeunload', function() {
        // Only save if form has content
        const formData = collectFormData();
        if (formData.nome || formData.endereco) {
            localStorage.setItem('newPatientFormDataTime', Date.now().toString());
        }
    });
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}