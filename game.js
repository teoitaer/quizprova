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
let questionsArray = []; // Array per tracciare domande e risposte

let questions = [];

// Legge il valore inserito nella combobox numsel di index.html
var a = localStorage.getItem("terValue");
var x = localStorage.getItem("selValue");
var y = localStorage.getItem("secValue");

// Carica il database per la materia selezionata
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
  .then(res => res.json())
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
    saveResults();  // Salva i risultati quando il quiz finisce
    return window.location.assign('end.html');
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  let questionIndex;
  if (a == "NO") {
    questionIndex = 0;
  } else if (a == "YES") {
    questionIndex = Math.floor(Math.random() * availableQuesions.length);
  }

  currentQuestion = availableQuesions[questionIndex];
  
  // Traccia la domanda corrente
  questionsArray.push({
    question: currentQuestion.question,
    choices: [
      currentQuestion.choice1,
      currentQuestion.choice2,
      currentQuestion.choice3,
      currentQuestion.choice4
    ],
    correctAnswer: currentQuestion.answer
  });

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

    // Registra la risposta selezionata
    loadQuestion(currentQuestion.question, [
      currentQuestion.choice1,
      currentQuestion.choice2,
      currentQuestion.choice3,
      currentQuestion.choice4
    ], selectedAnswer, currentQuestion.answer);

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

// Funzione per registrare la risposta
function loadQuestion(question, choices, selectedAnswer, correctAnswer) {
  quizResults.push({
    question: question,
    choices: choices,
    selectedAnswer: selectedAnswer,
    correctAnswer: correctAnswer
  });
}

// Funzione per salvare i risultati
function saveResults() {
  // Salva i risultati nel localStorage
  localStorage.setItem("quizResults", JSON.stringify(quizResults));
  localStorage.setItem("finalScore", score);
}

// Funzione per generare il PDF
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let yOffset = 10; // Distanza dall'alto del documento

  questionsArray.forEach((questionData, index) => {
    doc.text(`Q${index + 1}: ${questionData.question}`, 10, yOffset);
    yOffset += 10;

    questionData.choices.forEach((choice, i) => {
      const choiceLetter = String.fromCharCode(65 + i); // A, B, C, D...
      const isSelected = questionData.selectedAnswer == (i + 1) ? "(Selected)" : "";
      const isCorrect = questionData.correctAnswer == (i + 1) ? "(Correct)" : "";
      doc.text(`${choiceLetter}. ${choice} ${isSelected} ${isCorrect}`, 10, yOffset);
      yOffset += 10;
    });

    yOffset += 10; // Spazio extra tra le domande
  });

  doc.save('quiz_results.pdf');
}

// Aggiungi l'event listener per il bottone PDF solo se esiste
document.addEventListener('DOMContentLoaded', function () {
  const savePdfButton = document.getElementById('save-pdf');
  if (savePdfButton) {
    savePdfButton.addEventListener('click', generatePDF);
  } else {
    console.error("Pulsante save-pdf non trovato.");
  }
});

