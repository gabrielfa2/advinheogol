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
        this.maxAttempts = 6; // Alterado para 6 tentativas/dicas
        this.hintsRevealed = 0;
        this.gameEnded = false;
        this.gameWon = false;
        this.gameMode = 'daily';
        this.language = 'pt'; // Define o idioma padrão

        // NOVA ORDEM DE DICAS
        this.hintSequence = ['nationality', 'dominantFoot', 'competition', 'year', 'team', 'jerseyNumber'];

        this.dailyTimerInterval = null;

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
        this.dailyTimerDisplay = document.getElementById('daily-timer-display');
        this.countdownTimerModal = document.getElementById('countdownTimer');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGame();
        this.setupAutoComplete();
        this.updateUI();
        this.initializeDailyTimer();
    }
    
    // ... (initializeDailyTimer, setupEventListeners, handleCardVisibility, setupAutoComplete não foram alterados)

    initializeDailyTimer() {
        if (!this.dailyTimerDisplay && !this.countdownTimerModal) {
            console.warn("Nenhum elemento de cronômetro ('daily-timer-display' ou 'countdownTimer') foi encontrado.");
            return;
        }
        if (this.dailyTimerInterval) {
            clearInterval(this.dailyTimerInterval);
        }
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const timeLeft = tomorrow - now;
            let formattedTime = "00:00:00";
            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            if (this.dailyTimerDisplay) {
                this.dailyTimerDisplay.textContent = formattedTime;
            }
            if (this.countdownTimerModal) {
                this.countdownTimerModal.textContent = formattedTime;
            }
        };
        updateTimer();
        this.dailyTimerInterval = setInterval(updateTimer, 1000);
    }

    setupEventListeners() {
        this.guessButton.addEventListener('click', () => this.makeGuess());
        this.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
        this.playAgainButton.addEventListener('click', () => this.startNewGame('freeplay'));
        this.dailyChallengeButton.addEventListener('click', () => this.startNewGame('daily'));
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

    loadGame() {
        const today = new Date().toDateString();
        const lastPlayed = localStorage.getItem('lastPlayedDate');
        const savedGameState = localStorage.getItem('gameState');

        if (lastPlayed === today && savedGameState) {
            this.loadGameState(JSON.parse(savedGameState));
        } else {
            this.startNewGame('daily');
        }
    }

    startNewGame(mode = 'daily') {
        this.gameMode = mode;
        this.currentGoal = mode === 'daily' ? window.getDailyGoal() : window.getRandomGoal();
        this.attemptsUsed = 0;
        this.hintsRevealed = 0;
        this.gameEnded = false;
        this.gameWon = false;

        this.resetUI();
        this.loadVideo();
        
        // REVELA A PRIMEIRA DICA AUTOMATICAMENTE
        this.revealHint(this.hintSequence[0]);
        this.hintsRevealed = 1;

        this.updateUI();
        this.saveGameState();
    }

    resetUI() {
        this.videoElement.muted = true;
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        attemptBoxes.forEach(box => box.classList.remove('used', 'correct'));
        const hintItems = document.querySelectorAll('.hint-item');
        // Limpa todas as dicas, incluindo a nova dica de nacionalidade
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

    // ... (loadVideo e normalizeString não foram alterados)
    
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

    // LÓGICA DE DICA MODIFICADA
    handleIncorrectGuess() {
        this.playerInput.value = '';
        // Se ainda houver dicas para revelar na sequência
        if (this.hintsRevealed < this.hintSequence.length) {
            this.revealHint(this.hintSequence[this.hintsRevealed]);
            this.hintsRevealed++;
        }
        // Se todas as tentativas foram usadas
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

            // Aplica tradução se a dica for o pé dominante
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
    
    // ... (O restante das funções como showGoalDetailsCard, updateUI, showEndGameModal, etc., permanecem em grande parte as mesmas)
    
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
        
        // As mensagens do modal precisam ser traduzidas aqui no futuro
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
                goalId: this.currentGoal.id,
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
        this.currentGoal = window.GAME_DATA.find(goal => goal.id === gameState.goalId);
        if (!this.currentGoal) {
            this.startNewGame('daily'); // Fallback se o gol não for encontrado
            return;
        }

        this.attemptsUsed = gameState.attemptsUsed;
        this.hintsRevealed = gameState.hintsRevealed;
        this.gameEnded = gameState.gameEnded;
        this.gameWon = gameState.gameWon;
        
        this.loadVideo();
        this.resetUI(); // Garante uma UI limpa antes de recarregar o estado

        // Recarrega as tentativas
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        for (let i = 0; i < this.attemptsUsed; i++) {
            const isCorrectAttempt = this.gameWon && i === this.attemptsUsed - 1;
            attemptBoxes[i].classList.add(isCorrectAttempt ? 'correct' : 'used');
        }

        // Recarrega as dicas reveladas
        for (let i = 0; i < this.hintsRevealed; i++) {
            this.revealHint(this.hintSequence[i]);
        }
        
        if (this.gameEnded) {
            this.playerInput.disabled = true;
            this.guessButton.disabled = true;
            this.videoElement.muted = false;
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