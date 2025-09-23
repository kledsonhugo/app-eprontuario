/**
 * Sistema de Autenticação Simples
 * Gerencia login, logout e verificação de sessão
 */

class Auth {
    // Credenciais válidas (em produção, isso seria validado no backend)
    static validCredentials = {
        username: 'rebeca',
        password: 'rebeca123'
    };
    
    // Chaves para localStorage
    static SESSION_KEY = 'prontuario_session';
    static USER_KEY = 'prontuario_user';
    
    /**
     * Realiza o login do usuário
     * @param {string} username - Nome de usuário
     * @param {string} password - Senha
     * @returns {boolean} - True se login bem-sucedido
     */
    static login(username, password) {
        try {
            // Validar credenciais
            if (username === this.validCredentials.username && 
                password === this.validCredentials.password) {
                
                // Criar sessão
                const session = {
                    isAuthenticated: true,
                    loginTime: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
                };
                
                const user = {
                    username: username,
                    displayName: username,
                    role: 'admin'
                };
                
                // Salvar no localStorage
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                
                console.log('Login realizado com sucesso para:', username);
                return true;
            }
            
            console.log('Credenciais inválidas para:', username);
            return false;
            
        } catch (error) {
            console.error('Erro durante login:', error);
            return false;
        }
    }
    
    /**
     * Realiza o logout do usuário
     */
    static logout() {
        try {
            // Remover dados da sessão
            localStorage.removeItem(this.SESSION_KEY);
            localStorage.removeItem(this.USER_KEY);
            
            console.log('Logout realizado com sucesso');
            
            // Redirecionar para login
            window.location.href = 'login.html';
            
        } catch (error) {
            console.error('Erro durante logout:', error);
        }
    }
    
    /**
     * Verifica se o usuário está autenticado
     * @returns {boolean} - True se autenticado
     */
    static isAuthenticated() {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            
            if (!sessionData) {
                return false;
            }
            
            const session = JSON.parse(sessionData);
            
            // Verificar se a sessão expirou
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);
            
            if (now > expiresAt) {
                console.log('Sessão expirada');
                this.logout();
                return false;
            }
            
            return session.isAuthenticated === true;
            
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return false;
        }
    }
    
    /**
     * Obtém os dados do usuário logado
     * @returns {object|null} - Dados do usuário ou null
     */
    static getCurrentUser() {
        try {
            if (!this.isAuthenticated()) {
                return null;
            }
            
            const userData = localStorage.getItem(this.USER_KEY);
            return userData ? JSON.parse(userData) : null;
            
        } catch (error) {
            console.error('Erro ao obter usuário atual:', error);
            return null;
        }
    }
    
    /**
     * Protege uma página redirecionando para login se não autenticado
     * @param {string} returnUrl - URL para retornar após login (opcional)
     */
    static requireAuth(returnUrl = null) {
        if (!this.isAuthenticated()) {
            // Se não está autenticado, redirecionar para login
            const currentUrl = returnUrl || window.location.pathname + window.location.search;
            const encodedReturnUrl = encodeURIComponent(currentUrl);
            window.location.href = `login.html?returnUrl=${encodedReturnUrl}`;
            return false;
        }
        return true;
    }
    
    /**
     * Estende a sessão atual
     */
    static extendSession() {
        try {
            if (!this.isAuthenticated()) {
                return false;
            }
            
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            const session = JSON.parse(sessionData);
            
            // Estender por mais 24 horas
            session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            return true;
            
        } catch (error) {
            console.error('Erro ao estender sessão:', error);
            return false;
        }
    }
    
    /**
     * Inicializa o sistema de autenticação em uma página
     * Deve ser chamado em todas as páginas protegidas
     */
    static initialize() {
        // Verificar autenticação ao carregar a página
        if (!this.requireAuth()) {
            return false;
        }
        
        // Estender sessão se usuário está ativo
        this.extendSession();
        
        // Configurar verificação periódica da sessão (a cada 5 minutos)
        setInterval(() => {
            if (!this.isAuthenticated()) {
                alert('Sua sessão expirou. Você será redirecionado para a página de login.');
                this.logout();
            }
        }, 5 * 60 * 1000); // 5 minutos
        
        // Configurar logout automático em caso de inatividade (30 minutos)
        this.setupInactivityLogout();
        
        // Atualizar botões de logout com nome do usuário
        this.updateLogoutButtons();
        
        return true;
    }
    
    /**
     * Configura logout automático por inatividade
     */
    static setupInactivityLogout() {
        let inactivityTimer;
        const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos
        
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                alert('Você foi desconectado por inatividade.');
                this.logout();
            }, INACTIVITY_TIMEOUT);
        };
        
        // Eventos que resetam o timer de inatividade
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });
        
        // Inicializar o timer
        resetTimer();
    }
    
    /**
     * Atualiza os botões de logout para incluir o nome do usuário
     */
    static updateLogoutButtons() {
        const user = this.getCurrentUser();
        if (!user) return;
        
        // Encontrar todos os botões de logout
        const logoutButtons = document.querySelectorAll('a[onclick="Auth.logout()"]');
        
        logoutButtons.forEach(button => {
            // Atualizar o texto do botão para incluir o nome do usuário
            button.innerHTML = `<i class="fas fa-sign-out-alt me-2"></i>Sair, ${user.displayName}`;
        });
    }
}

// Tornar Auth disponível globalmente
window.Auth = Auth;