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
        
        this.hintSequence = ['team', 'year', 'competition', 'position', 'dominantFoot', 'jerseyNumber'];
        
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
        
        // MODIFICADO: Selecionando os dois elementos de cronômetro
        this.dailyTimerDisplay = document.getElementById('daily-timer-display'); // Cronômetro principal
        this.countdownTimerModal = document.getElementById('countdownTimer'); // Cronômetro dentro do Modal
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadGame();
        this.setupAutoComplete();
        this.updateUI();
        this.initializeDailyTimer(); 
    }
    
    // MODIFICADO: Esta função agora atualiza AMBOS os cronômetros
    initializeDailyTimer() {
        // Verifica se pelo menos um dos elementos de timer existe
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

            // Atualiza o cronômetro principal se ele existir
            if (this.dailyTimerDisplay) {
                this.dailyTimerDisplay.textContent = formattedTime;
            }

            // Atualiza o cronômetro do modal se ele existir
            if (this.countdownTimerModal) {
                this.countdownTimerModal.textContent = formattedTime;
            }
        };
        
        updateTimer();
        this.dailyTimerInterval = setInterval(updateTimer, 1000);
    }
    
    setupEventListeners() {
        // ... (o restante do seu código permanece igual)
        console.log('Setting up event listeners');
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
        // ... (sem alterações aqui)
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
        // ... (sem alterações aqui)
        this.videoElement.muted = true;
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        attemptBoxes.forEach(box => box.classList.remove('used', 'correct'));
        const hintItems = document.querySelectorAll('.hint-item');
        hintItems.forEach(item => {
            item.classList.remove('revealed');
            item.querySelector('.hint-value').textContent = '????';
        });
        this.playerInput.value = '';
        this.playerInput.disabled = false;
        this.guessButton.disabled = false;
        this.goalDetailsCard.style.display = 'none';
        this.goalDetailsCard.classList.remove('is-visible');
    }
    
    loadVideo() {
        // ... (sem alterações aqui)
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
        // ... (sem alterações aqui)
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }
    
    makeGuess() {
        // ... (sem alterações aqui)
        if (this.gameEnded) return;
        const guess = this.playerInput.value.trim();
        if (!guess) return;
        const normalizedGuess = this.normalizeString(guess);
        const normalizedAnswer = this.normalizeString(this.currentGoal.player);
        const isCorrect = normalizedGuess === normalizedAnswer;
        this.attemptsUsed++;
        this.updateAttemptBox(isCorrect);
        if (isCorrect) this.handleCorrectGuess();
        else this.handleIncorrectGuess();
        this.updateUI();
        this.saveGameState();
    }
    
    updateAttemptBox(isCorrect) {
        // ... (sem alterações aqui)
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        const currentBox = attemptBoxes[this.attemptsUsed - 1];
        if (isCorrect) currentBox.classList.add('correct');
        else currentBox.classList.add('used');
    }
    
    handleCorrectGuess() {
        // ... (sem alterações aqui)
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
        // ... (sem alterações aqui)
        this.playerInput.value = '';
        if (this.hintsRevealed < this.hintSequence.length) {
            this.revealHint(this.hintSequence[this.hintsRevealed]);
            this.hintsRevealed++;
        }
        if (this.attemptsUsed >= this.maxAttempts) this.handleGameOver();
    }
    
    handleGameOver() {
        // ... (sem alterações aqui)
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
        // ... (sem alterações aqui)
        const hintItem = document.querySelector(`[data-hint="${hintType}"]`);
        if (hintItem) {
            const hintValue = hintItem.querySelector('.hint-value');
            let value = this.currentGoal[hintType];
            if (hintType === 'dominantFoot') value = window.i18n.translateFootType(value);
            hintValue.textContent = value;
            hintItem.classList.add('revealed');
        }
    }

    revealAllHints() {
        this.hintSequence.forEach(hintType => this.revealHint(hintType));
    }
    
    showGoalDetailsCard() {
        // ... (sem alterações aqui)
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
        // ... (sem alterações aqui)
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
            modalTitle.textContent = window.i18n.t('congratulations') + ' 🎉';
            modalResult.textContent = window.i18n.t('winMessage', { attempts: this.attemptsUsed, maxAttempts: this.maxAttempts });
        } else {
            modalTitle.textContent = window.i18n.t('tooBad') + ' 😔';
            modalResult.textContent = window.i18n.t('loseMessage', { maxAttempts: this.maxAttempts });
        }
        
        goalPlayer.textContent = this.currentGoal.player;
        goalDescription.textContent = this.currentGoal.description;
        
        // MODIFICADO: A lógica continua a mesma, mas agora sabemos que o timer
        // dentro de 'nextGameCountdown' está sendo atualizado globalmente.
        if (this.gameMode === 'daily') {
            nextGameCountdown.style.display = 'block';
        } else {
            nextGameCountdown.style.display = 'none';
        }
        
        this.showVictoryChart();
    }
    
    showVictoryChart() {
        // ... (sem alterações aqui)
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
    
    // REMOVIDO: Esta função não é mais necessária.
    // startCountdown() { ... }
    
    updateStatistics(result, attempts) {
        // ... (sem alterações aqui)
        const stats = this.getStatistics();
        stats.totalGames++;
        if (result === 'win') {
            stats.totalWins++;
            stats.distribution[attempts] = (stats.distribution[attempts] || 0) + 1;
        }
        localStorage.setItem('gameStatistics', JSON.stringify(stats));
    }
    
    getStatistics() {
        // ... (sem alterações aqui)
        const defaultStats = { totalGames: 0, totalWins: 0, distribution: {} };
        const saved = localStorage.getItem('gameStatistics');
        return saved ? JSON.parse(saved) : defaultStats;
    }
    
    saveGameState() {
        // ... (sem alterações aqui)
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
        // ... (sem alterações aqui)
        this.currentGoal = window.GAME_DATA.find(goal => goal.id === gameState.goalId);
        this.attemptsUsed = gameState.attemptsUsed;
        this.hintsRevealed = gameState.hintsRevealed;
        this.gameEnded = gameState.gameEnded;
        this.gameWon = gameState.gameWon;
        this.loadVideo();
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        for (let i = 0; i < this.attemptsUsed; i++) {
            attemptBoxes[i].classList.add(this.gameWon && i === this.attemptsUsed - 1 ? 'correct' : 'used');
        }
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
    
    generateShareText() {
        // ... (sem alterações aqui)
        const emojiSequence = [];
        for (let i = 0; i < this.maxAttempts; i++) {
            if (i < this.attemptsUsed - 1) emojiSequence.push('🟥');
            else if (i === this.attemptsUsed - 1 && this.gameWon) emojiSequence.push('🟩');
            else if (i < this.attemptsUsed) emojiSequence.push('🟥');
            else emojiSequence.push('⬛');
        }
        const result = this.gameWon ? `${this.attemptsUsed}/${this.maxAttempts}` : `X/${this.maxAttempts}`;
        return `⚽ Advinhe o Gol #${this.currentGoal.id} ${result}\n\n${emojiSequence.join('')}\n\n#AdivinheOGol\nJogue em: ${window.location.href}`;
    }
}

// Export for ES modules
export { FootballQuizGame };

// Keep global for backward compatibility
window.FootballQuizGame = FootballQuizGame;