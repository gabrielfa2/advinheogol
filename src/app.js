// Import all modules to ensure they're included in the build
import './gameData.js';
import './autocomplete.js';
import './gameLogic.js';
import './modal.js';
import './i18n.js';

// Main application initialization
class App {
    constructor() {
        console.log('App constructor called');
        this.game = null;
        this.modal = null;
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        try {
            console.log('Initializing app...');
            
            // Initialize game
            this.game = new window.FootballQuizGame();
            console.log('Game initialized');
            
            // Initialize modal
            this.modal = new window.GameModal(this.game);
            console.log('Modal initialized');
            
            // Add any additional app-level functionality
            this.setupGlobalEventListeners();
            
            console.log('Adivinhe o Gol initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showErrorMessage('Erro ao carregar o jogo. Recarregue a página.');
        }
    }
    
    setupGlobalEventListeners() {
        // Handle visibility change to pause/resume video
        document.addEventListener('visibilitychange', () => {
            const video = document.getElementById('gameVideo');
            if (video) {
                if (document.hidden) {
                    video.pause();
                } else {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            }
        });
        
        // Handle window resize for responsive adjustments
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showConnectionMessage('Conexão restaurada', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showConnectionMessage('Sem conexão com a internet', 'warning');
        });
    }
    
    handleResize() {
        // Handle any resize-specific logic
        const modal = document.getElementById('gameEndModal');
        if (modal && modal.style.display === 'block') {
            // Ensure modal is properly positioned on resize
            modal.style.display = 'block';
        }
    }
    
    showErrorMessage(message) {
        const errorEl = document.createElement('div');
        errorEl.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
                font-family: Inter, sans-serif;
            ">
                <div style="
                    background: #1f2937;
                    padding: 32px;
                    border-radius: 16px;
                    text-align: center;
                    max-width: 400px;
                    margin: 20px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                ">
                    <h2 style="color: #ef4444; margin-bottom: 16px;">Erro</h2>
                    <p style="margin-bottom: 24px; line-height: 1.5;">${message}</p>
                    <button onclick="window.location.reload()" style="
                        background: #22c55e;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Recarregar Página</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorEl);
    }
    
    showConnectionMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s ease;
            ${type === 'success' ? 'background: #22c55e;' : 
              type === 'warning' ? 'background: #f59e0b;' : 'background: #ef4444;'}
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    const app = new App();
    
    // Make app globally available for debugging
    window.AdivinheOGol = app;
});

// Export for ES modules
export { App };