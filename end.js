const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

// Recupera il valore della materia selezionata nome e il cognome dell'allievo dal localStorage
const selectedSubject = localStorage.getItem('secValue');
const studentName = localStorage.getItem('name');
const studentSurname = localStorage.getItem('surname');

// Mostra il nome della materia e il nome dell'allievo sulla pagina
document.getElementById('subjectName').innerText = selectedSubject;
document.getElementById('studentName').innerText = `${studentName} ${studentSurname}`;

// Aggiungi il simbolo di percentuale al punteggio finale
finalScore.innerText = mostRecentScore + '%';
