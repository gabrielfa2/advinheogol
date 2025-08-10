// Modal functionality
import { startDailyCountdown } from './countdown.js';

class GameModal {
    constructor(game) {
        this.game = game;
        this.modal = document.getElementById('gameEndModal');
        this.closeBtn = document.querySelector('.modal-close');
        this.shareBtn = document.getElementById('shareButton');
        this.newGameBtn = document.getElementById('newGameButton');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Close modal events
        this.closeBtn.addEventListener('click', () => this.close());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });
        
        // Share button
        this.shareBtn.addEventListener('click', () => this.share());
        
        // New game button
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
    }
    
    close() {
        this.modal.style.display = 'none';
        
        // Clear countdown interval if it exists
        if (this.game.countdownInterval) {
            clearInterval(this.game.countdownInterval);
        }
    }
    
    async share() {
        const shareText = this.game.generateShareText();
        
        try {
            // Try native sharing first (mobile)
            if (navigator.share) {
                await navigator.share({
                    title: 'Advinhe o Gol',
                    text: shareText
                });
                this.showShareSuccess('Partilhado com sucesso!');
                return;
            }
            
            // Fallback to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareText);
                this.showShareSuccess('Copiado para a área de transferência!');
                return;
            }
            
            // Last resort - fallback copy method
            this.fallbackCopyToClipboard(shareText);
            this.showShareSuccess('Copiado para a área de transferência!');
            
        } catch (error) {
            console.error('Error sharing:', error);
            this.showShareError('Erro ao partilhar. Tente novamente.');
        }
    }
    
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            throw new Error('Copy failed');
        }
        
        document.body.removeChild(textArea);
    }
    
    showShareSuccess(message) {
        this.showShareMessage(message, 'success');
    }
    
    showShareError(message) {
        this.showShareMessage(message, 'error');
    }
    
    showShareMessage(message, type) {
        // Create temporary message element
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
            ${type === 'success' ? 'background: #22c55e;' : 'background: #ef4444;'}
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
        }, 2000);
    }
    
    startNewGame() {
        this.close();
        this.game.startNewGame('freeplay');
    }
}

// Export for ES modules
export { GameModal };

// Keep global for backward compatibility
window.GameModal = GameModal;