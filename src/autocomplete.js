// Autocomplete functionality
class AutoComplete {
    constructor(inputElement, suggestionsElement, playersList) {
        this.input = inputElement;
        this.suggestions = suggestionsElement;
        this.players = playersList;
        this.selectedIndex = -1;
        this.filteredPlayers = [];
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('blur', (e) => this.handleBlur(e));
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
    }
    
    handleInput(e) {
        const value = e.target.value.trim().toLowerCase();
        
        if (value.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.filteredPlayers = this.players.filter(player => 
            player.toLowerCase().includes(value)
        );
        
        if (this.filteredPlayers.length > 0) {
            this.showSuggestions();
        } else {
            this.hideSuggestions();
        }
    }
    
    handleKeydown(e) {
        if (!this.suggestions.style.display || this.suggestions.style.display === 'none') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredPlayers.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectPlayer(this.filteredPlayers[this.selectedIndex]);
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    
    handleBlur(e) {
        // Delay hiding to allow click on suggestion
        setTimeout(() => {
            this.hideSuggestions();
        }, 200);
    }
    
    handleDocumentClick(e) {
        if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
            this.hideSuggestions();
        }
    }
    
    showSuggestions() {
        this.suggestions.style.display = 'block';
        this.suggestions.innerHTML = '';
        this.selectedIndex = -1;
        
        this.filteredPlayers.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = player;
            item.addEventListener('click', () => this.selectPlayer(player));
            this.suggestions.appendChild(item);
        });
    }
    
    hideSuggestions() {
        this.suggestions.style.display = 'none';
        this.selectedIndex = -1;
    }
    
    updateSelection() {
        const items = this.suggestions.querySelectorAll('.suggestion-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
        
        // Scroll selected item into view
        if (this.selectedIndex >= 0) {
            const selectedItem = items[this.selectedIndex];
            selectedItem.scrollIntoView({ block: 'nearest' });
        }
    }
    
    selectPlayer(playerName) {
        this.input.value = playerName;
        this.hideSuggestions();
        this.input.focus();
        
        // Trigger input event to notify other components
        this.input.dispatchEvent(new Event('input'));
    }
    
    clear() {
        this.input.value = '';
        this.hideSuggestions();
    }
}

// Extract all unique player names from game data
function getAllPlayerNames() {
    return [...new Set(window.GAME_DATA.map(goal => goal.player))].sort();
}

// Export for ES modules
export { AutoComplete, getAllPlayerNames };

// Keep global for backward compatibility
window.AutoComplete = AutoComplete;
window.getAllPlayerNames = getAllPlayerNames;