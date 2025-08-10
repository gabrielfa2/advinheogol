// ... (código i18n e início da classe FootballQuizGame) ...
const i18n = {
    'pt': { 'Direito': 'Direito', 'Esquerdo': 'Esquerdo' },
    'en': { 'Direito': 'Right', 'Esquerdo': 'Left' },
    'es': { 'Direito': 'Diestro', 'Esquerdo': 'Zurdo' }
};
function translate(key, lang = 'pt') {
    return i18n[lang]?.[key] || key;
}

class FootballQuizGame {
    constructor() {
        this.modal = null;
        this.currentGoal = null;
        this.attemptsUsed = 0;
        this.maxAttempts = 7;
        this.hintsRevealed = 0;
        this.gameEnded = false;
        this.gameWon = false;
        this.gameMode = 'daily';
        this.language = 'pt';
        this.hintSequence = ['nationality', 'dominantFoot', 'competition', 'year', 'team', 'jerseyNumber'];
        this.videoElement = document.getElementById('gameVideo');
        this.playerInput = document.getElementById('playerInput');
        this.guessButton = document.getElementById('guessButton');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.dailyChallengeButton = document.getElementById('dailyChallengeButton');
        this.statsUsed = document.getElementById('statsUsed');
        this.statsRemaining = document.getElementById('statsRemaining');
        this.statsCorrect = document.getElementById('statsCorrect');
        this.goalDetailsCard = document.getElementById('goalDetailsCard');
    }

    init() {
        this.setupEventListeners();
        this.loadGame();
        this.setupAutoComplete();
        this.updateUI();
    }

    setModal(modalInstance) {
        this.modal = modalInstance;
    }

    updateUI() {
        const attemptsRemaining = this.maxAttempts - this.attemptsUsed;
        this.statsUsed.textContent = this.attemptsUsed;
        this.statsRemaining.textContent = attemptsRemaining >= 0 ? attemptsRemaining : 0;
        const stats = this.getStatistics();
        this.statsCorrect.textContent = stats.totalWins;
    }

    // ... (Todos os outros métodos de setupEventListeners até getStatistics permanecem aqui) ...
    setupEventListeners() {
        this.guessButton.addEventListener('click', () => this.makeGuess());
        this.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
        this.playAgainButton.addEventListener('click', () => this.startNewGame('freeplay'));
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
    loadGame() {
        this.initializeDailyChallenge();
    }
    initializeDailyChallenge() {
        this.gameMode = 'daily';
        const today = new Date().toDateString();
        const lastPlayed = localStorage.getItem('lastPlayedDate');
        const savedGameState = localStorage.getItem('gameState');
        const currentDailyGoalId = window.getDailyGoal().id;
        if (savedGameState) {
            const parsedState = JSON.parse(savedGameState);
            if (lastPlayed === today && parsedState.goalId === currentDailyGoalId) {
                this.loadGameState(parsedState);
                return;
            }
        }
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
    showEndGameModal() {
        if (!this.modal) {
            console.error("A instância do Modal não foi definida no jogo.");
            return;
        }
        this.modal.show(this.gameWon, this.attemptsUsed);
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

    /**
     * NOVO MÉTODO ADICIONADO
     * Gera o texto para compartilhamento ou o HTML para o modal de resultado.
     * @param {boolean} forSharing - Se true, retorna texto plano com emojis. Se false, retorna HTML.
     * @returns {string}
     */
    generateShareText(forSharing = true) {
        const goalId = this.gameMode === 'daily' ? `#${window.getDailyGoal().id}` : '';
        const title = `Advinhe o Gol ${goalId}`;
        
        let squares = '';
        for (let i = 0; i < this.attemptsUsed; i++) {
            const isCorrectAttempt = this.gameWon && i === this.attemptsUsed - 1;
            squares += isCorrectAttempt ? '🟩' : '🟥';
        }

        if (forSharing) {
            // Versão para compartilhar (texto plano com emojis)
            const resultLine = this.gameWon ? `${this.attemptsUsed}/${this.maxAttempts}` : `X/${this.maxAttempts}`;
            return `${title} ${resultLine}\n\n${squares}\n\nJogue também! https://advinheogol.com/`;
        } else {
            // Versão para o modal (HTML)
            let squaresHtml = '';
            for (let i = 0; i < this.maxAttempts; i++) {
                let boxClass = '';
                if (i < this.attemptsUsed) {
                    const isCorrectAttempt = this.gameWon && i === this.attemptsUsed - 1;
                    boxClass = isCorrectAttempt ? 'correct' : 'used';
                }
                squaresHtml += `<div class="attempt-box ${boxClass}"></div>`;
            }
            return `<div class="attempts-boxes">${squaresHtml}</div>`;
        }
    }

    // ... (O resto dos métodos, como saveGameState e loadGameState, permanecem aqui) ...
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
        this.currentGoal = window.getDailyGoal();
        if (!this.currentGoal || this.currentGoal.id !== gameState.goalId) {
            this.startNewGame('daily');
            return;
        }
        this.attemptsUsed = gameState.attemptsUsed;
        this.hintsRevealed = gameState.hintsRevealed;
        this.gameEnded = gameState.gameEnded;
        this.gameWon = gameState.gameWon;
        this.loadVideo();
        this.resetUI();
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        for (let i = 0; i < this.attemptsUsed; i++) {
            if (i < attemptBoxes.length) {
                const isCorrectAttempt = this.gameWon && i === this.attemptsUsed - 1;
                attemptBoxes[i].classList.add(isCorrectAttempt ? 'correct' : 'used');
            }
        }
        for (let i = 0; i < this.hintsRevealed; i++) {
            this.revealHint(this.hintSequence[i]);
        }
        if (this.gameEnded) {
            this.playerInput.disabled = true;
            this.guessButton.disabled = true;
            this.videoElement.muted = false;
            this.revealAllHints();
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