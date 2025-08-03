// Main game logic
class FootballQuizGame {
    constructor() {
        this.currentGoal = null;
        this.attemptsUsed = 0;
        this.maxAttempts = 7;
        this.hintsRevealed = 0;
        this.gameEnded = false;
        this.gameWon = false;
        this.gameMode = 'daily'; // 'daily' or 'freeplay'
        
        this.hintSequence = ['team', 'year', 'competition', 'position', 'dominantFoot', 'jerseyNumber'];
        
        // Get DOM elements
        this.videoElement = document.getElementById('gameVideo');
        this.playerInput = document.getElementById('playerInput');
        this.guessButton = document.getElementById('guessButton');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.dailyChallengeButton = document.getElementById('dailyChallengeButton');
        this.statsUsed = document.getElementById('statsUsed');
        this.statsRemaining = document.getElementById('statsRemaining');
        this.statsCorrect = document.getElementById('statsCorrect');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadGame();
        this.setupAutoComplete();
        this.updateUI();
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners');
        this.guessButton.addEventListener('click', () => this.makeGuess());
        this.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
        this.playAgainButton.addEventListener('click', () => this.startNewGame('freeplay'));
        this.dailyChallengeButton.addEventListener('click', () => this.startNewGame('daily'));
        
        // Debug: Log when button is clicked
        this.guessButton.addEventListener('click', () => {
            console.log('Guess button clicked');
        });
    }
    
    setupAutoComplete() {
        const playerNames = window.getAllPlayerNames();
        const suggestionsElement = document.getElementById('suggestions');
        this.autocomplete = new window.AutoComplete(this.playerInput, suggestionsElement, playerNames);
    }
    
    loadGame() {
        // Check if it's a new day for daily mode
        const today = new Date().toDateString();
        const lastPlayed = localStorage.getItem('lastPlayedDate');
        const savedGameState = localStorage.getItem('gameState');
        
        if (this.gameMode === 'daily' && lastPlayed === today && savedGameState) {
            // Load saved game state
            this.loadGameState(JSON.parse(savedGameState));
        } else {
            // Start new daily game
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
        
        // Reset UI
        this.resetUI();
        this.loadVideo();
        this.updateUI();
        this.saveGameState();
    }
    
    resetUI() {
        // Reset video
        this.videoElement.muted = true;
        
        // Reset attempts boxes
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        attemptBoxes.forEach(box => {
            box.classList.remove('used', 'correct');
        });
        
        // Reset hints
        const hintItems = document.querySelectorAll('.hint-item');
        hintItems.forEach(item => {
            item.classList.remove('revealed');
            item.querySelector('.hint-value').textContent = '????';
        });
        
        // Reset input
        this.playerInput.value = '';
        this.playerInput.disabled = false;
        this.guessButton.disabled = false;
        
        // Hide goal details card
        document.getElementById('goalDetailsCard').style.display = 'none';
    }
    
    loadVideo() {
        console.log('Loading video:', this.currentGoal.videoUrl);
        this.videoElement.src = this.currentGoal.videoUrl;
        this.videoElement.load();
        
        // Add error handling for video loading
        this.videoElement.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            console.error('Video URL:', this.currentGoal.videoUrl);
        });
        
        this.videoElement.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
        });
    }
    
    makeGuess() {
        console.log('makeGuess called');
        if (this.gameEnded) return;
        
        const guess = this.playerInput.value.trim();
        if (!guess) {
            console.log('Empty guess');
            return;
        }
        
        console.log('Guess:', guess, 'Correct answer:', this.currentGoal.player);
        
        const isCorrect = guess.toLowerCase() === this.currentGoal.player.toLowerCase();
        console.log('Is correct:', isCorrect);
        
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
        
        // enable audio
        this.videoElement.muted = false;
        
        // Show goal details card
        this.showGoalDetailsCard();
        
        // Disable controls
        this.playerInput.disabled = true;
        this.guessButton.disabled = true;
        
        // Update statistics
        this.updateStatistics('win', this.attemptsUsed);
        
        // Show end game modal after delay
        setTimeout(() => {
            this.showEndGameModal();
        }, 2000);
    }
    
    handleIncorrectGuess() {
        // Clear input
        this.playerInput.value = '';
        
        // Reveal next hint
        if (this.hintsRevealed < this.hintSequence.length) {
            this.revealHint(this.hintSequence[this.hintsRevealed]);
            this.hintsRevealed++;
        }
        
        // Check if game is over
        if (this.attemptsUsed >= this.maxAttempts) {
            this.handleGameOver();
        }
    }
    
    handleGameOver() {
        this.gameEnded = true;
        this.gameWon = false;
        
        // enable audio
        this.videoElement.muted = false;
        
        // Disable controls
        this.playerInput.disabled = true;
        this.guessButton.disabled = true;
        
        // Show correct answer
        this.showGoalDetailsCard();
        
        // Update statistics
        this.updateStatistics('loss', this.attemptsUsed);
        
        // Show end game modal after delay
        setTimeout(() => {
            this.showEndGameModal();
        }, 2000);
    }
    
    revealHint(hintType) {
        const hintItem = document.querySelector(`[data-hint="${hintType}"]`);
        if (hintItem) {
            const hintValue = hintItem.querySelector('.hint-value');
            hintValue.textContent = this.currentGoal[hintType];
            hintItem.classList.add('revealed');
        }
    }
    
    showGoalDetailsCard() {
        const card = document.getElementById('goalDetailsCard');
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
        
        card.style.display = 'block';
    }
    
    updateUI() {
        const attemptsRemaining = this.maxAttempts - this.attemptsUsed;
        this.statsUsed.textContent = this.attemptsUsed;
        this.statsRemaining.textContent = attemptsRemaining;
        
        // Update correct answers from statistics
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
        
        // Set modal content
        if (this.gameWon) {
            modalTitle.textContent = 'Parabéns! 🎉';
            modalResult.textContent = `Você acertou em ${this.attemptsUsed}/${this.maxAttempts} tentativas!`;
        } else {
            modalTitle.textContent = 'Que pena! 😔';
            modalResult.textContent = `Você esgotou as ${this.maxAttempts} tentativas.`;
        }
        
        goalPlayer.textContent = this.currentGoal.player;
        goalDescription.textContent = this.currentGoal.description;
        
        // Show countdown for daily mode
        if (this.gameMode === 'daily') {
            nextGameCountdown.style.display = 'block';
            this.startCountdown();
        } else {
            nextGameCountdown.style.display = 'none';
        }
        
        // Show victory chart
        this.showVictoryChart();
        
        modal.style.display = 'block';
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
    
    startCountdown() {
        const timer = document.getElementById('countdownTimer');
        
        const updateCountdown = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow - now;
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        
        // Store interval to clear it later
        this.countdownInterval = interval;
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
        const defaultStats = {
            totalGames: 0,
            totalWins: 0,
            distribution: {} // attempts -> count
        };
        
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
        this.attemptsUsed = gameState.attemptsUsed;
        this.hintsRevealed = gameState.hintsRevealed;
        this.gameEnded = gameState.gameEnded;
        this.gameWon = gameState.gameWon;
        
        // Restore UI state
        this.loadVideo();
        
        // Restore attempt boxes
        const attemptBoxes = document.querySelectorAll('.attempt-box');
        for (let i = 0; i < this.attemptsUsed; i++) {
            attemptBoxes[i].classList.add(this.gameWon && i === this.attemptsUsed - 1 ? 'correct' : 'used');
        }
        
        // Restore hints
        for (let i = 0; i < this.hintsRevealed; i++) {
            this.revealHint(this.hintSequence[i]);
        }
        
        // Restore game end state
        if (this.gameEnded) {
            this.playerInput.disabled = true;
            this.guessButton.disabled = true;
            this.videoElement.muted = false;
            this.showGoalDetailsCard();
        }
        
        this.updateUI();
    }
    
    generateShareText() {
        const today = new Date().toLocaleDateString('pt-PT');
        const emojiSequence = [];
        
        for (let i = 0; i < this.maxAttempts; i++) {
            if (i < this.attemptsUsed - 1) {
                emojiSequence.push('🟥'); // Wrong attempts
            } else if (i === this.attemptsUsed - 1 && this.gameWon) {
                emojiSequence.push('🟩'); // Correct attempt
            } else if (i < this.attemptsUsed) {
                emojiSequence.push('🟥'); // Failed attempts
            } else {
                emojiSequence.push('⬛'); // Unused attempts
            }
        }
        
        const result = this.gameWon ? 
            `${this.attemptsUsed}/${this.maxAttempts}` : 
            `X/${this.maxAttempts}`;
        
        return `⚽ Adivinhe o Gol #${this.currentGoal.id} ${result}\n\n${emojiSequence.join('')}\n\n#AdivinheOGol\nJogue em: ${window.location.href}`;
    }
}

// Export for ES modules
export { FootballQuizGame };

// Keep global for backward compatibility
window.FootballQuizGame = FootballQuizGame;