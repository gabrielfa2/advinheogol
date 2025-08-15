// Game data with football goals
const GAME_DATA = [
    {
        id: 1,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videoronaldo.mp4",
        player: "Ronaldo",
        team: "Corinthians",
        year: 2009,
        competition: "Campeonato Paulista",
        jerseyNumber: 9,
        dominantFoot: "Direito",
        nationality: "Brasileiro",
        description: "Um gol icónico de cobertura contra o Santos na final do Paulistão, demonstrando a classe e experiência do fenómeno brasileiro."
    },
    {
        id: 2,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videoronaldin.mp4",
        player: "Ronaldinho Gaúcho",
        team: "Atlético Mineiro",
        year: 2013,
        competition: "Copa Libertadores",
        jerseyNumber: 10,
        dominantFoot: "Direito",
        nationality: "Brasileiro",
        description: "Um gol de livre magistral que ajudou o Atlético a conquistar a Libertadores, mostrando toda a magia do craque gaúcho."
    },
    {
        id: 3,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance12.mp4",
        player: "Cristiano Ronaldo",
        team: "Real Madrid",
        year: 2018,
        competition: "Champions League",
        jerseyNumber: 7,
        dominantFoot: "Direito",
        nationality: "Português",
        description: "Gol de bicicleta antológico na Champions League, demonstrando a técnica e atleticismo do craque português."
    },
    {
        id: 4,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/lanceromario.mp4",
        player: "Romário",
        team: "Barcelona",
        year: 1994,
        competition: "La Liga",
        jerseyNumber: 11,
        dominantFoot: "Direito",
        nationality: "Brasileiro",
        description: "Um gol de oportunismo puro do baixinho, demonstrando sua capacidade de finalização dentro da área."
    },
    {
        id: 5,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance2.mp4",
        player: "Zico",
        team: "Flamengo",
        year: 1981,
        competition: "Copa Libertadores",
        jerseyNumber: 10,
        dominantFoot: "Direito",
        nationality: "Brasileiro",
        description: "Livre direto perfeito do Galinho de Quintino, um dos seus muitos golazos pelo Mengão na conquista da Libertadores."
    },
    {
        id: 6,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance3.mp4",
        player: "Kaká",
        team: "Milan",
        year: 2007,
        competition: "Champions League",
        jerseyNumber: 22,
        dominantFoot: "Direito",
        nationality: "Brasileiro",
        description: "Gol espetacular do craque brasileiro na semifinal da Champions, mostrando velocidade e precisão na finalização."
    },
    {
        id: 7,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance10.mp4",
        player: "Rivaldo",
        team: "Barcelona",
        year: 2001,
        competition: "La Liga",
        jerseyNumber: 10,
        dominantFoot: "Esquerdo",
        nationality: "Brasileiro",
        description: "Hat-trick histórico contra o Valencia, com o último gol sendo uma bicicleta antológica que garantiu a vaga na Champions."
    },
    {
        id: 8,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance6.mp4",
        player: "Messi",
        team: "Barcelona",
        year: 2012,
        competition: "Supercopa da Espanha",
        jerseyNumber: 10,
        dominantFoot: "Esquerdo",
        nationality: "Argentino",
        description: "Gol da pulga de falta absurdo contra o Real Madrid no El Classico na final da Supercopa da Espanha"
    },
    {
        id: 9,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance1.mp4",
        player: "Garrincha",
        team: "Brasil",
        year: 1962,
        competition: "Copa do Mundo",
        jerseyNumber: 7,
        dominantFoot: "Direito",
        nationality: "Brasileiro",
        description: "Gol mágico do Anjo das Pernas Tortas na Copa do Mundo do Chile, driblando meio time adversário antes de finalizar."
    },
    {
        id: 10,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance5.mp4",
        player: "Neymar",
        team: "Santos",
        year: 2011,
        competition: "Copa Libertadores",
        jerseyNumber: 11,
        dominantFoot: "Direito",
        nationality: "Brasileiro",
        description: "Gol antológico do jovem craque santista, mostrando dribles desconcertantes e finalização perfeita na conquista da Libertadores."
    },
    {
        id: 11,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance8.mp4",
        player: "Rivaldo",
        team: "Barcelona",
        year: 2001,
        competition: "La Liga",
        jerseyNumber: 10,
        dominantFoot: "Esquerdo",
        nationality: "Brasileiro",
        description: "Mais uma obra de arte de Rivaldo, com um chutaço de fora da área característico de sua genialidade."
    },
    {
        id: 12,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance9.mp4",
        player: "Rivaldo",
        team: "Barcelona",
        year: 2001,
        competition: "La Liga",
        jerseyNumber: 10,
        dominantFoot: "Esquerdo",
        nationality: "Brasileiro",
        description: "Gol de pura técnica e precisão do craque brasileiro em noite de La Liga, deixando o marcador para trás e finalizando com categoria."
    },
    {
        id: 13,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance13.mp4",
        player: "Raphinha",
        team: "Leeds",
        year: 2020,
        competition: "Premier League",
        jerseyNumber: 18,
        dominantFoot: "Esquerdo",
        nationality: "Brasileiro",
        description: "Gol de placa do craque brasileiro Raphinha mandando a bola na gaveta na goleade de 5 a 0 para cima do West Bromwich"
    },
    {
        id: 14,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance14.mp4",
        player: "Noni Madueke",
        team: "Chelsea",
        year: 2024,
        competition: "Premier League",
        jerseyNumber: 11,
        dominantFoot: "Direito",
        nationality: "Inglês",
        description: "Gol de oportunista para diminuir o placar contra o Aston Villa em um grande jogo na Premier League"
    },
    {
        id: 15,
        videoUrl: "https://pub-61992242d95c4c08a5588448f8a876fc.r2.dev/videolance15.mp4",
        player: "Kingsley Coman",
        team: "Bayern Munich",
        year: 2020,
        competition: "Bundesliga",
        jerseyNumber: 29,
        dominantFoot: "Direito",
        nationality: "Francês",
        description: "Gol de atacante nato do Coman defendendo a camisa do Bayern de Munique"
    },
    {
        id: 16,
        videoUrl: null,
        player: "Callum Hudson-Odoi",
        team: "Nottingham Forest",
        year: null,
        competition: null,
        jerseyNumber: 7,
        dominantFoot: "Direito",
        nationality: "Inglês",
        description: null
    },
    {
        id: 17,
        videoUrl: null,
        player: "Nathan Tella",
        team: "Bayer Leverkusen",
        year: null,
        competition: null,
        jerseyNumber: 23,
        dominantFoot: "Direito",
        nationality: "Nigeriano",
        description: null
    },
    {
        id: 18,
        videoUrl: null,
        player: "Alphonso Davies",
        team: "Bayern Munich",
        year: null,
        competition: null,
        jerseyNumber: 19,
        dominantFoot: "Direito",
        nationality: "Canadense",
        description: null
    },
    {
        id: 19,
        videoUrl: null,
        player: "Jamal Musiala",
        team: "Bayern Munich",
        year: null,
        competition: null,
        jerseyNumber: 42,
        dominantFoot: "Direito",
        nationality: "Alemão",
        description: null
    },
    {
        id: 20,
        videoUrl: null,
        player: "Domenico Berardi",
        team: "Sassuolo",
        year: null,
        competition: null,
        jerseyNumber: 25,
        dominantFoot: "Direito",
        nationality: "Italiano",
        description: null
    },
    {
        id: 21,
        videoUrl: null,
        player: "Edin Višća",
        team: "Galatasaray",
        year: null,
        competition: null,
        jerseyNumber: 7,
        dominantFoot: "Direito",
        nationality: "Bósnio",
        description: null
    },
    {
        id: 22,
        videoUrl: null,
        player: "Jarrod Bowen",
        team: "West Ham United",
        year: null,
        competition: null,
        jerseyNumber: 20,
        dominantFoot: "Direito",
        nationality: "Inglês",
        description: null
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

// Export for ES modules
export { GAME_DATA, getRandomGoal, getDailyGoal };

// Keep global variables for backward compatibility
window.GAME_DATA = GAME_DATA;
window.getRandomGoal = getRandomGoal;
window.getDailyGoal = getDailyGoal;