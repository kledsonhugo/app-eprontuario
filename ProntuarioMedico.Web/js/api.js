// API Configuration and Helper Functions
const API_BASE_URL = 'http://localhost:5135/api';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Generic fetch method with error handling
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorData || response.statusText}`);
            }

            // Check if response has content
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return null; // For responses like 204 No Content
            }
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return await this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data) {
        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint) {
        return await this.request(endpoint, { method: 'DELETE' });
    }

    // Pacientes endpoints
    async getPacientes() {
        return await this.get('/pacientes');
    }

    async getPaciente(id) {
        return await this.get(`/pacientes/${id}`);
    }

    async createPaciente(pacienteData) {
        return await this.post('/pacientes', pacienteData);
    }

    async updatePaciente(id, pacienteData) {
        const dataWithId = { ...pacienteData, id: id };
        return await this.put(`/pacientes/${id}`, dataWithId);
    }

    async deletePaciente(id) {
        return await this.delete(`/pacientes/${id}`);
    }

    async searchPacientes(termo) {
        return await this.get(`/pacientes/search?termo=${encodeURIComponent(termo)}`);
    }
}

// Create global instance
const apiService = new ApiService();

// Utility functions
const Utils = {
    // Format date for display (Brazilian format)
    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },

    // Format date for input (ISO format)
    formatDateForInput(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    },

    // Calculate age from birth date
    calculateAge(birthDate) {
        if (!birthDate) return 0;
        
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },

    // Show loading spinner
    showLoading() {
        const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
        modal.show();
    },

    // Hide loading spinner
    hideLoading() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
        if (modal) {
            modal.hide();
        }
    },

    // Show toast notification
    showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toastHtml = `
            <div class="toast align-items-center text-white bg-${type} border-0 position-fixed top-0 end-0 m-3" 
                 role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 9999;">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                            data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastElement = document.querySelector('.toast:last-child');
        const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
        toast.show();

        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    },

    // Show confirmation dialog
    async showConfirmDialog(message, title = 'Confirmação') {
        return new Promise((resolve) => {
            // Remove existing confirmation modals
            const existingModals = document.querySelectorAll('.confirm-modal');
            existingModals.forEach(modal => modal.remove());

            const modalHtml = `
                <div class="modal fade confirm-modal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p>${message}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="confirmCancel">
                                    Cancelar
                                </button>
                                <button type="button" class="btn btn-danger" id="confirmOk">
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            const modalElement = document.querySelector('.confirm-modal:last-child');
            const modal = new bootstrap.Modal(modalElement);
            
            modalElement.querySelector('#confirmOk').addEventListener('click', () => {
                modal.hide();
                resolve(true);
            });

            modalElement.querySelector('#confirmCancel').addEventListener('click', () => {
                modal.hide();
                resolve(false);
            });

            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });

            modal.show();
        });
    },

    // Validate form
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
        });

        return isValid;
    },

    // Clear form validation
    clearFormValidation(form) {
        const fields = form.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });
    },

    // Truncate text
    truncateText(text, maxLength = 50) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },

    // Debounce function for search
    debounce(func, wait) {
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
};

// Global error handler
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    Utils.showToast('Ocorreu um erro inesperado. Tente novamente.', 'danger');
});

// Export for use in other files
window.apiService = apiService;
window.Utils = Utils;