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


 // legge il valore inserito nella combobox numsel di index.html
var a = localStorage.getItem("terValue");
    //alert(a);

 // legge il valore inserito nella combobox numsel di index.html
var x = localStorage.getItem("selValue");
   // alert(x);

// legge il valore inserito nella combobox subjectsel di index.html
var y = localStorage.getItem("secValue");
   // alert(y);



// carica il database per la materia selezionata
var z;
if(y=="AL ENG"){
    z='alen.json';
} else if (y=="AGK ENG"){
    z='agken.json';
} else if (y=="OPS ENG"){
    z='opsen.json';
} else if (y=="HPL ENG"){
    z='hplen.json';
} else if (y=="NAV ENG"){
    z='naven.json';
} else if (y=="MET ENG"){
    z='meten.json';
} else if (y=="FPP ENG"){
    z='fppen.json';
} else if (y=="POF ENG"){
    z='pofen.json';
} else if (y=="COM ENG"){
    z='comen.json';
} 



 fetch(z)
    .then(res => { return res.json();})
    .then(loadedQuestions => {
        questions = loadedQuestions;
       
        startGame();
    })
     .catch(err => {
         console.error(err);
    });




//CONSTANTS
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

        //go to the end page
        return window.location.assign('quizprova/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    
    
// nuovo

    // la variabile b prende il valore dalla chackbox random in index.html. 
    // il codice imposta le domande in ordine sequenziale o random
var b;

    if (a=="NO"){
    b= 0;
} else if (a=="YES") {
    b = Math.floor(Math.random() * availableQuesions.length);
}

// alert(b);
     
const questionIndex = b

    // fine nuovo 

    currentQuestion = availableQuesions[questionIndex];
// riempie il campo id
    questionid.innerText = currentQuestion.questionid;

// riempie il campo domanda
    question.innerText = currentQuestion.question;

// riempie i campi delle risposte
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

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;

      scoreText.innerText = (score/x) * 100;

// codice nuovo per pdf

 
let questionsArray = [];

function loadQuestion(question, choices, selectedAnswer) {
  // Aggiungi la domanda corrente e le risposte all'array
  questionsArray.push({
    question: question,
    choices: choices,
    selectedAnswer: selectedAnswer,
    correctAnswer: correctAnswer // Se disponibile
  });
}

// Modifica il caricamento della domanda e del tracciamento della risposta
// Aggiungi il codice di tracciamento al momento in cui l'utente seleziona una risposta

 function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Impostazioni di base
  let yOffset = 10; // Distanza dall'alto del documento

  questionsArray.forEach((questionData, index) => {
    doc.text(`Q${index + 1}: ${questionData.question}`, 10, yOffset);
    yOffset += 10; // Spazio per la domanda

    questionData.choices.forEach((choice, i) => {
      const choiceLetter = String.fromCharCode(65 + i); // A, B, C, D...
      const isSelected = questionData.selectedAnswer === choice ? "(Selected)" : "";
      const isCorrect = questionData.correctAnswer === choice ? "(Correct)" : "";
      doc.text(`${choiceLetter}. ${choice} ${isSelected} ${isCorrect}`, 10, yOffset);
      yOffset += 10; // Spazio tra le risposte
    });

    yOffset += 10; // Spazio extra tra le domande
  });

  // Salva il PDF
  doc.save('quiz_results.pdf');
}

// Chiama la funzione al termine del quiz
document.getElementById('save-pdf').addEventListener('click', generatePDF);

};
