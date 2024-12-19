const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

// Recupera nome, cognome e materia dal localStorage
const selectedSubject = localStorage.getItem('secValue');
//const studentFirstName = localStorage.getItem('studentFirstName');
//const studentLastName = localStorage.getItem('studentLastName');

// Mostra il nome completo dello studente e la materia selezionata
document.getElementById('studentName').innerText = studentFirstName + ' ' + studentLastName;
document.getElementById('subjectName').innerText = selectedSubject;


const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 10;

// Aggiungi il simbolo di percentuale al punteggio finale
finalScore.innerText = mostRecentScore + '%';
//finalScore.innerText = mostRecentScore;

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
