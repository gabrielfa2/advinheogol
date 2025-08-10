// Aguarda o conteúdo da página ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', function() {

    // Encontra os elementos do HTML que vamos manipular
    const countdownContainer = document.getElementById('nextGameCountdown');
    const timerElement = document.getElementById('countdownTimer');

    // Se não encontrar os elementos necessários, interrompe o script para evitar erros.
    if (!countdownContainer || !timerElement) {
        console.error('Elementos do cronômetro não encontrados no HTML.');
        return;
    }

    function startDailyCountdown() {
        // Torna o container do cronômetro visível
        countdownContainer.style.display = 'block'; // ou 'flex', dependendo do seu CSS

        // Define um intervalo para atualizar o cronômetro a cada 1 segundo
        const countdownInterval = setInterval(() => {
            // Pega a data e hora atuais
            const now = new Date();

            // Define a data de amanhã à meia-noite (o ponto final da contagem)
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            // Calcula a diferença de tempo em milissegundos
            const timeLeft = tomorrow.getTime() - now.getTime();

            // Se o tempo acabou (passou da meia-noite)
            if (timeLeft <= 0) {
                // Para o intervalo para não continuar executando
                clearInterval(countdownInterval);
                // Exibe 00:00:00
                timerElement.textContent = '00:00:00';
                // Recarrega a página para reiniciar a contagem e carregar o novo desafio
                // Usamos um pequeno delay para que o usuário veja o zero antes do refresh.
                setTimeout(() => {
                    location.reload(); 
                }, 1000); // Aguarda 1 segundo antes de recarregar
                return;
            }

            // Converte a diferença de tempo para horas, minutos e segundos
            const hours = Math.floor((timeLeft / (1000 * 60 * 60)));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Formata os números para sempre terem dois dígitos (ex: 09, 08, 07)
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            // Atualiza o texto do cronômetro no HTML
            timerElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

        }, 1000); // A função executa a cada 1000ms (1 segundo)
    }

    // Inicia a função do cronômetro
    startDailyCountdown();

});