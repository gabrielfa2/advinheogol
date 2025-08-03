// Game data with football goals
const GAME_DATA = [
    {
        id: 1,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        player: "Ronaldo",
        team: "Corinthians",
        year: 2009,
        competition: "Campeonato Paulista",
        position: "Avançado",
        jerseyNumber: 9,
        dominantFoot: "Direito",
        description: "Um golo icónico de cobertura contra o Santos na final do Paulistão, demonstrando a classe e experiência do fenómeno brasileiro."
    },
    {
        id: 2,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        player: "Ronaldinho Gaúcho",
        team: "Atlético Mineiro",
        year: 2013,
        competition: "Copa Libertadores",
        position: "Médio Ofensivo",
        jerseyNumber: 10,
        dominantFoot: "Direito",
        description: "Um golo de livre magistral que ajudou o Atlético a conquistar a Libertadores, mostrando toda a magia do craque gaúcho."
    },
    {
        id: 3,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        player: "Pelé",
        team: "Brasil",
        year: 1970,
        competition: "Copa do Mundo",
        position: "Avançado",
        jerseyNumber: 10,
        dominantFoot: "Direito",
        description: "O golo do século na final da Copa do Mundo de 1970, consolidando Pelé como o maior jogador de todos os tempos."
    },
    {
        id: 4,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        player: "Romário",
        team: "Barcelona",
        year: 1994,
        competition: "La Liga",
        position: "Avançado",
        jerseyNumber: 11,
        dominantFoot: "Direito",
        description: "Um golo de oportunismo puro do baixinho, demonstrando sua capacidade de finalização dentro da área."
    },
    {
        id: 5,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        player: "Zico",
        team: "Flamengo",
        year: 1981,
        competition: "Copa Libertadores",
        position: "Médio Ofensivo",
        jerseyNumber: 10,
        dominantFoot: "Direito",
        description: "Livre direto perfeito do Galinho de Quintino, um dos seus muitos golazos pelo Mengão na conquista da Libertadores."
    },
    {
        id: 6,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        player: "Kaká",
        team: "Milan",
        year: 2007,
        competition: "Champions League",
        position: "Médio Ofensivo",
        jerseyNumber: 22,
        dominantFoot: "Direito",
        description: "Golo espetacular do craque brasileiro na semifinal da Champions, mostrando velocidade e precisão na finalização."
    },
    {
        id: 7,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        player: "Rivaldo",
        team: "Barcelona",
        year: 2001,
        competition: "La Liga",
        position: "Médio Ofensivo",
        jerseyNumber: 10,
        dominantFoot: "Esquerdo",
        description: "Hat-trick histórico contra o Valencia, com o último golo sendo uma bicicleta antológica que garantiu a vaga na Champions."
    },
    {
        id: 8,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        player: "Bebeto",
        team: "Deportivo",
        year: 1992,
        competition: "La Liga",
        position: "Avançado",
        jerseyNumber: 11,
        dominantFoot: "Direito",
        description: "Golo decisivo na conquista histórica do campeonato espanhol pelo Deportivo, demonstrando a categoria do atacante brasileiro."
    },
    {
        id: 9,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        player: "Garrincha",
        team: "Brasil",
        year: 1962,
        competition: "Copa do Mundo",
        position: "Extremo Direito",
        jerseyNumber: 7,
        dominantFoot: "Direito",
        description: "Golo mágico do Anjo das Pernas Tortas na Copa do Mundo do Chile, driblando meio time adversário antes de finalizar."
    },
    {
        id: 10,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        player: "Neymar",
        team: "Santos",
        year: 2011,
        competition: "Copa Libertadores",
        position: "Extremo Esquerdo",
        jerseyNumber: 11,
        dominantFoot: "Direito",
        description: "Golo antológico do jovem craque santista, mostrando dribles desconcertantes e finalização perfeita na conquista da Libertadores."
    }
];

console.log('GAME_DATA loaded:', GAME_DATA.length, 'goals');

// Helper function to get random goal
function getRandomGoal() {
    const randomIndex = Math.floor(Math.random() * GAME_DATA.length);
    return GAME_DATA[randomIndex];
}

// Helper function to get goal of the day (based on date)
function getDailyGoal() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const goalIndex = dayOfYear % GAME_DATA.length;
    return GAME_DATA[goalIndex];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GAME_DATA, getRandomGoal, getDailyGoal };
}