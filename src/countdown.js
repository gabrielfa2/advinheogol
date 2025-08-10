/**
 * Inicia uma contagem regressiva diária até a meia-noite.
 * @param {HTMLElement} timerElement - O elemento HTML onde o tempo será exibido.
 * @returns {number} O ID do intervalo, para que possa ser limpo mais tarde.
 */
export function startDailyCountdown(timerElement) {
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const timeLeft = tomorrow.getTime() - now.getTime();

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerElement.textContent = '00:00:00';
            setTimeout(() => { location.reload(); }, 1000);
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        timerElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }, 1000);

    return countdownInterval; // Retorna o ID para que possamos limpá-lo
}