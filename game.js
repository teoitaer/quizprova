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
        localStorage.setItem('quizResults', JSON.stringify(quizResults)); // Memorizza i risultati del quiz
        return window.location.assign('/quizprova/end.html'); // Vai alla pagina end.html
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


