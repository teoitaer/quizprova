const questionid = document.getElementById('questionid');
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];
let quizResults = [];  // Array per salvare le risposte

// legge il valore inserito nella combobox numsel di index.html
var a = localStorage.getItem("terValue");
var x = localStorage.getItem("selValue");
var y = localStorage.getItem("secValue");

// carica il database per la materia selezionata
var z;
if (y == "AL ENG") {
    z = 'alen.json';
} else if (y == "AGK ENG") {
    z = 'agken.json';
} else if (y == "OPS ENG") {
    z = 'opsen.json';
} else if (y == "HPL ENG") {
    z = 'hplen.json';
} else if (y == "NAV ENG") {
    z = 'naven.json';
} else if (y == "MET ENG") {
    z = 'meten.json';
} else if (y == "FPP ENG") {
    z = 'fppen.json';
} else if (y == "POF ENG") {
    z = 'pofen.json';
} else if (y == "COM ENG") {
    z = 'comen.json';
}

fetch(z)
    .then(res => { return res.json(); })
    .then(loadedQuestions => {
        questions = loadedQuestions;
        startGame();
    })
    .catch(err => {
        console.error(err);
    });

// CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = x;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {

    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', scoreText.innerText);
        generatePDF();  // Chiama la funzione per generare il PDF
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    var b;
    if (a == "NO") {
        b = 0;
    } else if (a == "YES") {
        b = Math.floor(Math.random() * availableQuesions.length);
    }

    const questionIndex = b;

    currentQuestion = availableQuesions[questionIndex];
    questionid.innerText = currentQuestion.questionid;
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        // Aggiungi la risposta selezionata ai risultati
        quizResults.push({
            question: currentQuestion.question,
            choices: [
                currentQuestion.choice1,
                currentQuestion.choice2,
                currentQuestion.choice3,
                currentQuestion.choice4
            ],
            selectedAnswer: selectedAnswer,
            correctAnswer: currentQuestion.answer
        });

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = (score / x) * 100;
};







function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width; // Larghezza della pagina
    const margin = 10; // Margine per il testo
    const textWidth = pageWidth - 2 * margin; // Larghezza disponibile per il testo
    let yOffset = 10; // Distanza iniziale dall'alto della pagina
    const maxY = 280; // Altezza massima prima di andare a capo (per evitare sovrapposizioni)
    const lineHeight = 10; // Altezza di una riga di testo

    quizResults.forEach((questionData, index) => {
        // Verifica se abbiamo spazio per aggiungere la domanda corrente, altrimenti aggiungi una nuova pagina
        if (yOffset + (questionData.choices.length + 1) * lineHeight > maxY) {
            doc.addPage();
            yOffset = 10; // Reset yOffset per la nuova pagina
        }

        // Aggiungi la domanda
        let questionText = `Q${index + 1}: ${questionData.question}`;
        let questionLines = doc.splitTextToSize(questionText, textWidth);
        doc.text(questionLines, margin, yOffset);
        yOffset += questionLines.length * lineHeight; // Aumenta l'offset in base al numero di righe

        // Aggiungi le risposte
        questionData.choices.forEach((choice, i) => {
            const choiceLetter = String.fromCharCode(65 + i); // A, B, C, D...
            const isSelected = questionData.selectedAnswer == (i + 1) ? "(Selected)" : "";
            const isCorrect = questionData.correctAnswer == (i + 1) ? "(Correct)" : "";

            let choiceText = `${choiceLetter}. ${choice} ${isSelected} ${isCorrect}`;
            let choiceLines = doc.splitTextToSize(choiceText, textWidth);
            doc.text(choiceLines, margin, yOffset);
            yOffset += choiceLines.length * lineHeight; // Aumenta l'offset in base al numero di righe
        });

        yOffset += 10; // Spazio extra tra le domande
    });

    doc.save('quiz_results.pdf');
}

