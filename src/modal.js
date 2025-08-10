// Modal functionality
import { startDailyCountdown } from './countdown.js';

class GameModal {
    constructor(game) {
        this.game = game;
        this.modal = document.getElementById('gameEndModal');
        this.closeBtn = document.querySelector('.modal-close');
        this.shareBtn = document.getElementById('shareButton');
        this.newGameBtn = document.getElementById('newGameButton');
        this.countdownIntervalId = null; // Para guardar o ID do nosso cronômetro

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    /**
     * NOVO MÉTODO: Abre e configura o modal com o resultado do jogo.
     * Este é o ponto central para exibir o modal.
     * @param {boolean} isWin - O jogador venceu?
     * @param {number} attempts - Número de tentativas usadas.
     */
    show(isWin, attempts) {
        // Pega os elementos de conteúdo do modal
        const modalTitle = document.getElementById('modalTitle');
        const modalResult = document.getElementById('modalResult');
        const goalPlayer = document.getElementById('goalPlayer');
        const goalDescription = document.getElementById('goalDescription');
        const countdownContainer = document.getElementById('nextGameCountdown');

        // Configura o conteúdo com base no resultado
        modalTitle.textContent = isWin ? 'Parabéns!' : 'Não foi desta vez!';
        modalResult.innerHTML = this.game.generateShareText(false); // Gera os quadrados de resultado
        goalPlayer.textContent = this.game.currentGoal.player;
        goalDescription.textContent = this.game.currentGoal.description;

        // Limpa qualquer cronômetro anterior antes de iniciar um novo
        if (this.countdownIntervalId) {
            clearInterval(this.countdownIntervalId);
        }

        // LÓGICA DO CRONÔMETRO: só ativa para o modo 'daily'
        if (this.game.mode === 'daily') {
            const timerElement = document.getElementById('countdownTimer');
            if (countdownContainer && timerElement) {
                countdownContainer.style.display = 'block';
                // Inicia o cronômetro e guarda seu ID
                this.countdownIntervalId = startDailyCountdown(timerElement);
            }
            // No modo diário, o botão "Novo Jogo" não deve aparecer
            this.newGameBtn.style.display = 'none';
        } else {
            // Se for modo livre ('freeplay'), esconde o cronômetro e mostra o botão "Novo Jogo"
            countdownContainer.style.display = 'none';
            this.newGameBtn.style.display = 'block';
        }
        
        // Atualiza o gráfico de vitórias
        this.game.stats.updateVictoryChart();

        // Finalmente, exibe o modal
        this.modal.style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';

        // Ao fechar o modal, para o cronômetro para economizar recursos
        if (this.countdownIntervalId) {
            clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = null;
        }
    }

    startNewGame() {
        this.close();
        // O `gameLogic.js` deve ter um método para reiniciar o jogo
        this.game.startNewGame('freeplay');
    }
    
    // --- MÉTODOS DE COMPARTILHAMENTO (permanecem os mesmos) ---
    async share() {
        const shareText = this.game.generateShareText(true);
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Advinhe o Gol', text: shareText });
                this.showShareSuccess('Partilhado com sucesso!');
                return;
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareText);
                this.showShareSuccess('Copiado para a área de transferência!');
                return;
            }
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
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            padding: 12px 24px; border-radius: 8px; color: white;
            font-weight: 500; z-index: 3000; opacity: 0;
            transition: opacity 0.3s ease;
            ${type === 'success' ? 'background: #22c55e;' : 'background: #ef4444;'}
        `;
        document.body.appendChild(messageEl);
        setTimeout(() => { messageEl.style.opacity = '1'; }, 100);
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 2000);
    }

    // --- SETUP DE EVENT LISTENERS (permanece o mesmo) ---
    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => this.close());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });
        this.shareBtn.addEventListener('click', () => this.share());
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
    }
}

// Export for ES modules
export { GameModal };

// Keep global for backward compatibility
window.GameModal = GameModal;