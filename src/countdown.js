/**
 * Inicia uma contagem regressiva diária até a meia-noite.
 * @param {HTMLElement} timerElement - O elemento HTML (ex: <span>) onde o tempo será exibido.
 */
export function startDailyCountdown(timerElement) {
    // A função é chamada apenas quando temos certeza que o elemento existe,
    // então não precisamos verificar de novo aqui.

    const countdownInterval = setInterval(() => {
        const now = new Date();

        // Define a data de amanhã à meia-noite
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const timeLeft = tomorrow.getTime() - now.getTime();

        // Se o tempo acabou
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerElement.textContent = '00:00:00';
            setTimeout(() => {
                // Em vez de recarregar a página inteira, podemos apenas
                // chamar uma função para reiniciar o jogo, se existir.
                // Por enquanto, location.reload() é simples e eficaz.
                location.reload(); 
            }, 1000);
            return;
        }

        // Converte para horas, minutos e segundos
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Formata para HH:MM:SS
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        // Atualiza o texto no elemento fornecido
        timerElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }, 1000);
}