// Objeto de tradução para futura implementação multilingue
const i18n = {
    'pt': {
        'Direito': 'Direito',
        'Esquerdo': 'Esquerdo'
    },
    'en': {
        'Direito': 'Right',
        'Esquerdo': 'Left'
    },
    'es': {
        'Direito': 'Diestro',
        'Esquerdo': 'Zurdo'
    }
};

// Função de tradução (exemplo simples)
function translate(key, lang = 'pt') {
    return i18n[lang][key] || key;
}


// Main game logic
class FootballQuizGame {
    constructor() {
        this.currentGoal = null;
        this.attemptsUsed = 0;
        this.maxAttempts = 7;
        this.hintsRevealed = 0;
        this.gameEnded = false;
        this.gameWon = false;
        this.gameMode = 'daily';
        this.language = 'pt';

        this.hintSequence = ['nationality', 'dominantFoot', 'competition', 'year', 'team', 'jerseyNumber'];
        this.dailyCountdownTimer = null;

        // Get DOM elements
        this.videoElement = document.getElementById('gameVideo');
        this.playerInput = document.getElementById('playerInput');
        this.guessButton = document.getElementById('guessButton');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.dailyChallengeButton = document.getElementById('dailyChallengeButton');
        this.statsUsed = document.getElementById('statsUsed');
        this.statsRemaining = document.getElementById('statsRemaining');
        this.statsCorrect = document.getElementById('statsCorrect');
        this.goalDetailsCard = document.getElementById('goalDetailsCard');
        this.countdownTimerModal = document.getElementById('countdownTimer');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGame(); // Inicia o jogo diário ao carregar a página
        this.setupAutoComplete();
        this.updateUI();
        this.initializeDailyCountdown();
    }
    
    initializeDailyCountdown() {
        if (!this.countdownTimerModal) {
            console.warn("Elemento 'countdownTimer' não foi encontrado.");
            return;
        }
        
        // Destrói o cronômetro anterior se existir
        if (this.dailyCountdownTimer) {
            this.dailyCountdownTimer.destroy();
        }
        
        // Cria novo cronômetro usando a classe DailyCountdownTimer
        this.dailyCountdownTimer = new window.DailyCountdownTimer('countdownTimer', {
            format: 'HH:MM:SS',
            autoStart: true,
            onComplete: () => {
                console.log('Novo desafio diário disponível!');
                // Aqui você pode adicionar lógica adicional quando um novo dia começar
                // Por exemplo, mostrar uma notificação ou recarregar o desafio
            },
            onTick: (timeLeft, formattedTime) => {
                // Callback opcional para cada segundo que passa
                // Pode ser usado para animações ou outras atualizações
            }
        });
    }

    setupEventListeners() {
        this.guessButton.addEventListener('click', () => this.makeGuess());
        this.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
        this.playAgainButton.addEventListener('click', () => this.startNewGame('freeplay'));

        // ALTERAÇÃO: O botão do desafio diário agora chama a nova lógica de inicialização.
        this.dailyChallengeButton.addEventListener('click', () => this.initializeDailyChallenge());

        window.addEventListener('scroll', () => this.handleCardVisibility());
        window.addEventListener('resize', () => this.handleCardVisibility());
    }

    handleCardVisibility() {
        if (!this.gameEnded) return;
        if (window.scrollY > 20) {
            this.goalDetailsCard.classList.add('is-visible');
        } else {
            this.goalDetailsCard.classList.remove('is-visible');
        }
    }

    setupAutoComplete() {
        const playerNames = window.getAllPlayerNames();
        const suggestionsElement = document.getElementById('suggestions');
        this.autocomplete = new window.AutoComplete(this.playerInput, suggestionsElement, playerNames);
    }
    
    // ALTERAÇÃO: A função loadGame agora apenas chama a nova lógica centralizada.
    loadGame() {
        this.initializeDailyChallenge();
    }

    // NOVO MÉTODO: Centraliza a lógica para iniciar ou carregar o desafio diário.
    initializeDailyChallenge() {
        this.gameMode = 'daily';
        const today = new Date().toDateString();
        const lastPlayed = localStorage.getItem('lastPlayedDate');
        const savedGameState = localStorage.getItem('gameState');
        const currentDailyGoalId = window.getDailyGoal().id;

        // Verifica se o estado salvo é de hoje E se corresponde ao gol diário atual
        if (savedGameState) {
            const parsedState = JSON.parse(savedGameState);
            if (lastPlayed === today && parsedState.goalId === currentDailyGoalId) {
                this.loadGameState(parsedState);
                return; // Impede a criação de um novo jogo
            }
        }

        // Se nenhuma condição acima for atendida, inicia um novo jogo diário.
        this.startNewGame('daily');
    }

    startNewGame(mode) {
        this.gameMode = mode;
        this.currentGoal = mode === 'daily' ? window.getDailyGoal() : window.getRandomGoal();
        this.attemptsUsed = 0;
        this.hintsRevealed = 0;
        this.gameEnded = false;
        this.gameWon = false;

        this.resetUI();
        this.loadVideo();
        this.updateUI();
        
        // Salva o estado inicial do jogo assim que ele começa.
        // Isso garante que se o usuário fechar a aba, ele poderá continuar de onde parou.
        this.saveGameState();
    }

    resetUI() {
        this.videoElement.muted = true;
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        attemptBoxes.forEach(box => box.classList.remove('used', 'correct'));
        const hintItems = document.querySelectorAll('.hint-item');
        hintItems.forEach(item => {
            item.classList.remove('revealed');
            const hintValue = item.querySelector('.hint-value');
            if (hintValue) {
                hintValue.textContent = '????';
            }
        });
        this.playerInput.value = '';
        this.playerInput.disabled = false;
        this.guessButton.disabled = false;
        this.goalDetailsCard.style.display = 'none';
        this.goalDetailsCard.classList.remove('is-visible');
    }

    loadVideo() {
        console.log('Loading video:', this.currentGoal.videoUrl);
        this.videoElement.src = this.currentGoal.videoUrl;
        this.videoElement.load();
        this.videoElement.addEventListener('error', (e) => console.error('Video loading error:', e));
        this.videoElement.addEventListener('loadeddata', () => {
            this.videoElement.muted = true;
            this.videoElement.play().catch(e => console.error('Video autoplay failed:', e));
        });
    }

    normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    makeGuess() {
        if (this.gameEnded) return;
        const guess = this.playerInput.value.trim();
        if (!guess) return;

        const normalizedGuess = this.normalizeString(guess);
        const normalizedAnswer = this.normalizeString(this.currentGoal.player);
        const isCorrect = normalizedGuess === normalizedAnswer;

        this.attemptsUsed++;
        this.updateAttemptBox(isCorrect);

        if (isCorrect) {
            this.handleCorrectGuess();
        } else {
            this.handleIncorrectGuess();
        }

        this.updateUI();
        this.saveGameState();
    }

    updateAttemptBox(isCorrect) {
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        if (this.attemptsUsed > attemptBoxes.length) return;
        const currentBox = attemptBoxes[this.attemptsUsed - 1];
        if (isCorrect) {
            currentBox.classList.add('correct');
        } else {
            currentBox.classList.add('used');
        }
    }

    handleCorrectGuess() {
        this.gameWon = true;
        this.gameEnded = true;
        this.videoElement.muted = false;
        this.revealAllHints();
        this.showGoalDetailsCard();
        this.playerInput.disabled = true;
        this.guessButton.disabled = true;
        this.updateStatistics('win', this.attemptsUsed);
        setTimeout(() => this.showEndGameModal(), 1000);
    }

    handleIncorrectGuess() {
        this.playerInput.value = '';
        if (this.hintsRevealed < this.hintSequence.length) {
            this.revealHint(this.hintSequence[this.hintsRevealed]);
            this.hintsRevealed++;
        }
        if (this.attemptsUsed >= this.maxAttempts) {
            this.handleGameOver();
        }
    }

    handleGameOver() {
        this.gameEnded = true;
        this.gameWon = false;
        this.videoElement.muted = false;
        this.playerInput.disabled = true;
        this.guessButton.disabled = true;
        this.showGoalDetailsCard();
        this.updateStatistics('loss', this.attemptsUsed);
        setTimeout(() => this.showEndGameModal(), 1000);
    }

    revealHint(hintType) {
        const hintItem = document.querySelector(`[data-hint="${hintType}"]`);
        if (hintItem) {
            const hintValue = hintItem.querySelector('.hint-value');
            let value = this.currentGoal[hintType];
            if (hintType === 'dominantFoot') {
                value = translate(value, this.language);
            }
            hintValue.textContent = value;
            hintItem.classList.add('revealed');
        }
    }

    revealAllHints() {
        this.hintSequence.forEach(hintType => this.revealHint(hintType));
    }
    
    showGoalDetailsCard() {
        const playerName = document.getElementById('cardPlayerName');
        const description = document.getElementById('cardDescription');
        const team = document.getElementById('cardTeam');
        const year = document.getElementById('cardYear');
        const competition = document.getElementById('cardCompetition');
        playerName.textContent = this.currentGoal.player;
        description.textContent = this.currentGoal.description;
        team.textContent = this.currentGoal.team;
        year.textContent = this.currentGoal.year;
        competition.textContent = this.currentGoal.competition;
        this.goalDetailsCard.style.display = 'block';
        setTimeout(() => this.handleCardVisibility(), 10);
    }
    
    updateUI() {
        const attemptsRemaining = this.maxAttempts - this.attemptsUsed;
        this.statsUsed.textContent = this.attemptsUsed;
        this.statsRemaining.textContent = attemptsRemaining;
        const stats = this.getStatistics();
        this.statsCorrect.textContent = stats.totalWins;
    }
    
    showEndGameModal() {
        const modal = document.getElementById('gameEndModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalResult = document.getElementById('modalResult');
        const goalPlayer = document.getElementById('goalPlayer');
        const goalDescription = document.getElementById('goalDescription');
        const nextGameCountdown = document.getElementById('nextGameCountdown');

        modal.style.display = 'block';
        
        if (this.gameWon) {
            modalTitle.textContent = 'Parabéns! 🎉';
            modalResult.textContent = `Você acertou em ${this.attemptsUsed} de ${this.maxAttempts} tentativas.`;
        } else {
            modalTitle.textContent = 'Que pena! 😔';
            modalResult.textContent = `Você usou todas as ${this.maxAttempts} tentativas.`;
        }
        
        goalPlayer.textContent = this.currentGoal.player;
        goalDescription.textContent = this.currentGoal.description;
        
        if (this.gameMode === 'daily') {
            nextGameCountdown.style.display = 'block';
            // Garante que o cronômetro está funcionando quando o modal é exibido
            if (!this.dailyCountdownTimer || !this.dailyCountdownTimer.isActive()) {
                this.initializeDailyCountdown();
            }
        } else {
            nextGameCountdown.style.display = 'none';
        }
        
        this.showVictoryChart();
    }
    
    showVictoryChart() {
        const chartContainer = document.getElementById('victoryChart');
        const stats = this.getStatistics();
        chartContainer.innerHTML = '';
        for (let i = 1; i <= this.maxAttempts; i++) {
            const count = stats.distribution[i] || 0;
            const percentage = stats.totalGames > 0 ? (count / stats.totalGames) * 100 : 0;
            const row = document.createElement('div');
            row.className = 'chart-row';
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = i;
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            const fill = document.createElement('div');
            fill.className = 'chart-fill';
            fill.style.width = `${percentage}%`;
            const countEl = document.createElement('div');
            countEl.className = 'chart-count';
            countEl.textContent = count;
            bar.appendChild(fill);
            row.appendChild(label);
            row.appendChild(bar);
            row.appendChild(countEl);
            chartContainer.appendChild(row);
        }
    }
    
    updateStatistics(result, attempts) {
        const stats = this.getStatistics();
        stats.totalGames++;
        if (result === 'win') {
            stats.totalWins++;
            stats.distribution[attempts] = (stats.distribution[attempts] || 0) + 1;
        }
        localStorage.setItem('gameStatistics', JSON.stringify(stats));
    }
    
    getStatistics() {
        const defaultStats = { totalGames: 0, totalWins: 0, distribution: {} };
        const saved = localStorage.getItem('gameStatistics');
        return saved ? JSON.parse(saved) : defaultStats;
    }
    
    saveGameState() {
        if (this.gameMode === 'daily') {
            const gameState = {
                goalId: this.currentGoal.id, // Salva o ID do gol para verificação
                attemptsUsed: this.attemptsUsed,
                hintsRevealed: this.hintsRevealed,
                gameEnded: this.gameEnded,
                gameWon: this.gameWon
            };
            localStorage.setItem('gameState', JSON.stringify(gameState));
            localStorage.setItem('lastPlayedDate', new Date().toDateString());
        }
    }
    
    loadGameState(gameState) {
        this.currentGoal = window.getDailyGoal(); // Garante que estamos sempre carregando o gol do dia
        if (!this.currentGoal || this.currentGoal.id !== gameState.goalId) {
            // Se o ID do gol salvo for diferente do atual, é um novo dia.
            this.startNewGame('daily'); 
            return;
        }

        this.attemptsUsed = gameState.attemptsUsed;
        this.hintsRevealed = gameState.hintsRevealed;
        this.gameEnded = gameState.gameEnded;
        this.gameWon = gameState.gameWon;
        
        this.loadVideo();
        this.resetUI(); 

        // Recarrega as tentativas
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        for (let i = 0; i < this.attemptsUsed; i++) {
            if (i < attemptBoxes.length) {
                const isCorrectAttempt = this.gameWon && i === this.attemptsUsed - 1;
                attemptBoxes[i].classList.add(isCorrectAttempt ? 'correct' : 'used');
            }
        }

        // Recarrega as dicas reveladas
        for (let i = 0; i < this.hintsRevealed; i++) {
            this.revealHint(this.hintSequence[i]);
        }
        
        if (this.gameEnded) {
            this.playerInput.disabled = true;
            this.guessButton.disabled = true;
            this.videoElement.muted = false;
            this.revealAllHints(); // Garante que todas as dicas sejam exibidas no final
            this.showGoalDetailsCard();
            setTimeout(() => this.showEndGameModal(), 10);
        }

        this.updateUI();
    }
}

// Export for ES modules
export { FootballQuizGame };

// Keep global for backward compatibility
window.FootballQuizGame = FootballQuizGame;