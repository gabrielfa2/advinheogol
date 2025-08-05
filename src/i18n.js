// Internationalization (i18n) functionality
class I18n {
    constructor() {
        this.currentLanguage = 'br'; // Default language
        this.translations = {
            br: {
                welcome: 'Bem vindo, Jogador',
                attemptsUsed: 'Tentativas Usadas',
                attemptsRemaining: 'Tentativas Restantes',
                hits: 'Acertos',
                team: 'Equipe',
                year: 'Ano',
                competition: 'Competição',
                position: 'Posição',
                number: 'Número',
                dominantFoot: 'Pé Dominante',
                playerPlaceholder: 'Digite o nome do jogador...',
                guess: 'Adivinhar',
                dailyChallenge: '📅 Desafio Diário',
                freePlay: '🎮 Jogar à Vontade',
                congratulations: 'Parabéns!',
                tooBad: 'Que pena!',
                victoryDistribution: 'Distribuição de Vitórias',
                share: '📱 Partilhar',
                newGame: '🎯 Novo Jogo',
                nextChallenge: 'Próximo desafio em:',
                termsOfUse: 'Termos de Uso',
                privacyPolicy: 'Política de Privacidade',
                contact: 'Contato',
                // Modal messages
                winMessage: 'Você acertou em {attempts}/{maxAttempts} tentativas!',
                loseMessage: 'Você esgotou as {maxAttempts} tentativas.',
                // Foot types
                direito: 'Direito',
                esquerdo: 'Esquerdo',
                ambidestro: 'Ambidestro'
            },
            en: {
                welcome: 'Welcome, Player',
                attemptsUsed: 'Attempts Used',
                attemptsRemaining: 'Attempts Remaining',
                hits: 'Hits',
                team: 'Team',
                year: 'Year',
                competition: 'Competition',
                position: 'Position',
                number: 'Number',
                dominantFoot: 'Dominant Foot',
                playerPlaceholder: 'Enter player name...',
                guess: 'Guess',
                dailyChallenge: '📅 Daily Challenge',
                freePlay: '🎮 Free Play',
                congratulations: 'Congratulations!',
                tooBar: 'Too bad!',
                victoryDistribution: 'Victory Distribution',
                share: '📱 Share',
                newGame: '🎯 New Game',
                nextChallenge: 'Next challenge in:',
                termsOfUse: 'Terms of Use',
                privacyPolicy: 'Privacy Policy',
                contact: 'Contact',
                // Modal messages
                winMessage: 'You got it right in {attempts}/{maxAttempts} attempts!',
                loseMessage: 'You used all {maxAttempts} attempts.',
                // Foot types
                direito: 'Right',
                esquerdo: 'Left',
                ambidestro: 'Ambidextrous'
            },
            es: {
                welcome: 'Bienvenido, Jugador',
                attemptsUsed: 'Intentos Usados',
                attemptsRemaining: 'Intentos Restantes',
                hits: 'Aciertos',
                team: 'Equipo',
                year: 'Año',
                competition: 'Competición',
                position: 'Posición',
                number: 'Número',
                dominantFoot: 'Pie Dominante',
                playerPlaceholder: 'Introduce el nombre del jugador...',
                guess: 'Adivinar',
                dailyChallenge: '📅 Reto Diario',
                freePlay: '🎮 Juego Libre',
                congratulations: '¡Felicidades!',
                tooBar: '¡Qué pena!',
                victoryDistribution: 'Distribución de Victorias',
                share: '📱 Compartir',
                newGame: '🎯 Nuevo Juego',
                nextChallenge: 'Próximo desafío en:',
                termsOfUse: 'Términos de Uso',
                privacyPolicy: 'Política de Privacidad',
                contact: 'Contacto',
                // Modal messages
                winMessage: '¡Acertaste en {attempts}/{maxAttempts} intentos!',
                loseMessage: 'Agotaste los {maxAttempts} intentos.',
                // Foot types
                direito: 'Derecho',
                esquerdo: 'Izquierdo',
                ambidestro: 'Ambidiestro'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupLanguageButtons();
        this.loadSavedLanguage();
        this.changeLanguage(this.currentLanguage);
    }
    
    setupLanguageButtons() {
        const langButtons = {
            'lang-en': 'en',
            'lang-es': 'es',
            'lang-br': 'br'
        };
        
        Object.entries(langButtons).forEach(([buttonId, langCode]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.changeLanguage(langCode);
                });
            }
        });
    }
    
    loadSavedLanguage() {
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        }
    }
    
    changeLanguage(langCode) {
        if (!this.translations[langCode]) {
            console.warn(`Language ${langCode} not found, using default (br)`);
            langCode = 'br';
        }
        
        this.currentLanguage = langCode;
        localStorage.setItem('selectedLanguage', langCode);
        
        // Update active button
        this.updateActiveButton(langCode);
        
        // Translate all elements
        this.translateElements();
        
        // Update placeholder
        this.updatePlaceholder();
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: langCode } 
        }));
    }
    
    updateActiveButton(langCode) {
        // Remove active class from all buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected button
        const activeButton = document.getElementById(`lang-${langCode}`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
    
    translateElements() {
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }
    
    updatePlaceholder() {
        const input = document.querySelector('[data-key-placeholder]');
        if (input) {
            const key = input.getAttribute('data-key-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                input.placeholder = translation;
            }
        }
    }
    
    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] || 
               this.translations['br'][key] || 
               key;
    }
    
    // Method to get translated text programmatically
    t(key, replacements = {}) {
        let translation = this.getTranslation(key);
        
        // Replace placeholders like {attempts} with actual values
        Object.entries(replacements).forEach(([placeholder, value]) => {
            translation = translation.replace(`{${placeholder}}`, value);
        });
        
        return translation;
    }
    
    // Method to translate foot type values
    translateFootType(footType) {
        const normalizedFoot = footType.toLowerCase();
        return this.getTranslation(normalizedFoot) || footType;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Create global instance
window.i18n = new I18n();

// Export for ES modules
export { I18n };