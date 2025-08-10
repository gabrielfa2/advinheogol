// Como estamos usando "defer", não precisamos mais do 'DOMContentLoaded'.
// O script só vai rodar quando o HTML estiver pronto.

// Encontra os elementos do HTML que vamos manipular
const countdownContainer = document.getElementById('nextGameCountdown');
const timerElement = document.getElementById('countdownTimer');

// Se encontrar os elementos, inicia a contagem.
if (countdownContainer && timerElement) {
    startDailyCountdown();
} else {
    // A mensagem de erro ainda é útil se os IDs mudarem no futuro.
    console.error('Elementos do cronômetro não encontrados no HTML.');
}

function startDailyCountdown() {
    // Torna o container do cronômetro visível
    countdownContainer.style.display = 'block'; // ou 'flex', dependendo do seu CSS

    // Define um intervalo para atualizar o cronômetro a cada 1 segundo
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const timeLeft = tomorrow.getTime() - now.getTime();

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerElement.textContent = '00:00:00';
            setTimeout(() => {
                location.reload(); 
            }, 1000);
            return;
        }

        const hours = Math.floor((timeLeft / (1000 * 60 * 60)));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        timerElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    }, 1000);
}