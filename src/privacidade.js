// src/privacidade.js

// 1. Importa o arquivo de estilos compartilhado
import './styles.css';

console.log("Script da página de privacidade executando via módulo Vite!");

// Language switching functionality
const langButtons = document.querySelectorAll('.lang-btn');
const contentSections = document.querySelectorAll('.content-section');
const backText = document.querySelector('[data-back-text]');

const translations = {
    'br': '← Voltar ao Jogo',
    'en': '← Back to Game',
    'es': '← Volver al Juego'
};

langButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons
        langButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Hide all content sections
        contentSections.forEach(section => section.classList.remove('active'));
        
        // Show selected content section
        const lang = button.id.split('-')[1];
        const targetContent = document.getElementById(`content-${lang}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Update back button text
        if (backText && translations[lang]) {
            backText.textContent = translations[lang];
        }
    });
});