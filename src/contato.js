// src/contato.js

// 1. Importa o arquivo de estilos compartilhado. 
// O Vite irá processar isso e injetar o CSS na página.
import './styles.css';

// 2. Adicione aqui qualquer código JS que era específico da página contato.html.
// Por exemplo, o script que estava no final do body.
console.log("Script da página de contato executando via módulo Vite!");

// Language switching functionality
const langButtons = document.querySelectorAll('.lang-btn');
const contentSections = document.querySelectorAll('.content-section');

langButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const lang = button.id.split('-')[1];
        
        // Remove active class from all buttons and sections
        langButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        // Add active class to clicked button and corresponding section
        button.classList.add('active');
        document.getElementById(`content-${lang}`).classList.add('active');
    });
});