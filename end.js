const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

// Recupera il valore della materia selezionata nome e il cognome dell'allievo dal localStorage
const selectedSubject = localStorage.getItem('secValue');
const studentName = localStorage.getItem('name');
const studentSurname = localStorage.getItem('surname');

// Mostra il nome della materia e il nome dell'allievo sulla pagina
document.getElementById('subjectName').innerText = selectedSubject;
document.getElementById('studentName').innerText = `${studentName} ${studentSurname}`;


//const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

//const MAX_HIGH_SCORES = 10;

// Aggiungi il simbolo di percentuale al punteggio finale
finalScore.innerText = mostRecentScore + '%';

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/');
};
