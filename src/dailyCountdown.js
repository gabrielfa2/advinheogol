/**
 * Daily Countdown Timer - Sistema de cronômetro regressivo para desafio diário
 * 
 * Esta classe gerencia um cronômetro que conta o tempo restante até a próxima meia-noite,
 * sendo usado para mostrar quando o próximo desafio diário estará disponível.
 * 
 * Características:
 * - Cálculo preciso até a próxima meia-noite
 * - Atualização em tempo real a cada segundo
 * - Reinício automático quando chega a zero
 * - Formato HH:MM:SS
 * - Considera fuso horário local
 * - Gerenciamento de memória otimizado
 */

class DailyCountdownTimer {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.intervalId = null;
        this.isRunning = false;
        
        // Configurações padrão
        this.options = {
            format: 'HH:MM:SS',
            autoStart: true,
            onComplete: null,
            onTick: null,
            onReset: null,
            ...options
        };
        
        // Validação do elemento
        if (!this.element) {
            console.error(`DailyCountdownTimer: Elemento com ID '${elementId}' não encontrado`);
            return;
        }
        
        // Auto-inicialização se configurado
        if (this.options.autoStart) {
            this.start();
        }
    }
    
    /**
     * Calcula o tempo restante até a próxima meia-noite
     * @returns {Object} Objeto com horas, minutos, segundos e total em milissegundos
     */
    calculateTimeUntilMidnight() {
        const now = new Date();
        const tomorrow = new Date(now);
        
        // Define para o próximo dia às 00:00:00.000
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeLeft = tomorrow.getTime() - now.getTime();
        
        // Se por algum motivo o tempo for negativo, retorna 24 horas
        if (timeLeft <= 0) {
            return {
                total: 24 * 60 * 60 * 1000,
                hours: 24,
                minutes: 0,
                seconds: 0
            };
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        return {
            total: timeLeft,
            hours,
            minutes,
            seconds
        };
    }
    
    /**
     * Formata o tempo no formato especificado
     * @param {Object} timeObj Objeto com horas, minutos e segundos
     * @returns {string} Tempo formatado
     */
    formatTime(timeObj) {
        const { hours, minutes, seconds } = timeObj;
        
        switch (this.options.format) {
            case 'HH:MM:SS':
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            case 'H:MM:SS':
                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            case 'HH:MM':
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            default:
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    /**
     * Atualiza o display do cronômetro
     */
    updateDisplay() {
        const timeLeft = this.calculateTimeUntilMidnight();
        const formattedTime = this.formatTime(timeLeft);
        
        // Atualiza o elemento DOM
        if (this.element) {
            this.element.textContent = formattedTime;
        }
        
        // Callback personalizado para cada tick
        if (typeof this.options.onTick === 'function') {
            this.options.onTick(timeLeft, formattedTime);
        }
        
        // Verifica se chegou ao fim (menos de 1 segundo restante)
        if (timeLeft.total <= 1000) {
            this.handleComplete();
        }
        
        return timeLeft;
    }
    
    /**
     * Manipula o evento de conclusão do cronômetro
     */
    handleComplete() {
        // Callback personalizado para conclusão
        if (typeof this.options.onComplete === 'function') {
            this.options.onComplete();
        }
        
        // Reinicia automaticamente para o próximo ciclo
        this.reset();
        
        // Callback personalizado para reset
        if (typeof this.options.onReset === 'function') {
            this.options.onReset();
        }
    }
    
    /**
     * Inicia o cronômetro
     */
    start() {
        if (this.isRunning) {
            console.warn('DailyCountdownTimer: Cronômetro já está em execução');
            return;
        }
        
        // Atualização inicial
        this.updateDisplay();
        
        // Configura o intervalo de atualização
        this.intervalId = setInterval(() => {
            this.updateDisplay();
        }, 1000);
        
        this.isRunning = true;
        console.log('DailyCountdownTimer: Cronômetro iniciado');
    }
    
    /**
     * Para o cronômetro
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.isRunning = false;
        console.log('DailyCountdownTimer: Cronômetro parado');
    }
    
    /**
     * Reinicia o cronômetro
     */
    reset() {
        this.stop();
        this.start();
        console.log('DailyCountdownTimer: Cronômetro reiniciado');
    }
    
    /**
     * Destrói o cronômetro e limpa recursos
     */
    destroy() {
        this.stop();
        this.element = null;
        this.options = null;
        console.log('DailyCountdownTimer: Cronômetro destruído');
    }
    
    /**
     * Verifica se o cronômetro está em execução
     * @returns {boolean}
     */
    isActive() {
        return this.isRunning;
    }
    
    /**
     * Obtém o tempo restante atual sem atualizar o display
     * @returns {Object}
     */
    getCurrentTime() {
        return this.calculateTimeUntilMidnight();
    }
}

/**
 * Função utilitária para criar um cronômetro rapidamente
 * @param {string} elementId ID do elemento DOM
 * @param {Object} options Opções de configuração
 * @returns {DailyCountdownTimer}
 */
function createDailyCountdown(elementId, options = {}) {
    return new DailyCountdownTimer(elementId, options);
}

/**
 * Função utilitária para calcular tempo até meia-noite (uso independente)
 * @returns {Object}
 */
function getTimeUntilMidnight() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
        return { hours: 24, minutes: 0, seconds: 0, total: 24 * 60 * 60 * 1000 };
    }
    
    return {
        hours: Math.floor(timeLeft / (1000 * 60 * 60)),
        minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
        total: timeLeft
    };
}

// Exportações para ES modules
export { DailyCountdownTimer, createDailyCountdown, getTimeUntilMidnight };

// Compatibilidade global para uso direto
window.DailyCountdownTimer = DailyCountdownTimer;
window.createDailyCountdown = createDailyCountdown;
window.getTimeUntilMidnight = getTimeUntilMidnight;