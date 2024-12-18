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
        return window.location.assign('/quizprova/end.html');
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











// Funzione per generare il PDF con l'intestazione che mostra il punteggio
function generatePDF() {
    return new Promise((resolve, reject) => {
        // Mostra la finestra di conferma personalizzata
        const modal = document.getElementById("confirmationModal");
        const confirmButton = document.getElementById("confirmButton");
        const cancelButton = document.getElementById("cancelButton");

        modal.style.display = "flex"; // Mostra la finestra modale

        // Aggiungiamo degli event listener per i pulsanti di conferma e annullamento

        // Funzione che viene chiamata quando l'utente conferma
        confirmButton.onclick = function () {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Impostare margini più stretti
            const margin = 20;
            const textWidth = doc.internal.pageSize.width - 2 * margin;
            const lineHeight = 8;
            const maxY = 280;
            let yOffset = 20;

            // Recupera nome e cognome dal localStorage
            const name = localStorage.getItem("nome") || "Nome non fornito";
            const surname = localStorage.getItem("cognome") || "Cognome non fornito";


            // Imposta il carattere più piccolo
            doc.setFontSize(8);

            // Aggiungi l'intestazione con il punteggio
           // doc.setFontSize(12);  // Aumenta temporaneamente la dimensione del font per l'intestazione
            // doc.text(`Quiz Results - Score: ${score}`, margin, yOffset);  // Inserisce il punteggio
            // yOffset += 20;  // Aggiunge spazio dopo l'intestazione


 // Prendere il punteggio dal testo dello score
            const finalScore = scoreText.innerText;  // Ora viene definito correttamente

            // Aggiungi un'intestazione con il punteggio
            doc.setFontSize(12);
            doc.text(`Quiz Results - Final Score: ${finalScore}%`, margin, yOffset);
            yOffset += 10; // Spazio sotto l'intestazione

  // Aggiungi nome e cognome all'intestazione
            doc.text(`Candidate: ${nome} ${cognome}`, margin, yOffset);
            yOffset += 20; // Spazio sotto l'intestazione del nome e cognome
            

            // Ripristina la dimensione del carattere più piccola
            doc.setFontSize(8);

            quizResults.forEach((questionData, index) => {
                if (yOffset + (questionData.choices.length + 1) * lineHeight > maxY) {
                    doc.addPage();
                    yOffset = 20;
                }

                let questionText = `Q${index + 1}: ${questionData.question}`;
                let questionLines = doc.splitTextToSize(questionText, textWidth);
                doc.text(questionLines, margin, yOffset);
                yOffset += questionLines.length * lineHeight;

                questionData.choices.forEach((choice, i) => {
                    const choiceLetter = String.fromCharCode(65 + i); 
                    const isSelected = questionData.selectedAnswer == (i + 1) ? "(Selected)" : "";
                    const isCorrect = questionData.correctAnswer == (i + 1) ? "(Correct)" : "";

                    let choiceText = `${choiceLetter}. ${choice} ${isSelected} ${isCorrect}`;

                    if (questionData.selectedAnswer == (i + 1) && questionData.correctAnswer == (i + 1)) {
                        doc.setTextColor(0, 128, 0); // Verde
                    } else if (questionData.selectedAnswer == (i + 1) && questionData.correctAnswer != (i + 1)) {
                        doc.setTextColor(255, 0, 0); // Rosso
                    } else {
                        doc.setTextColor(0, 0, 0); // Nero
                    }

                    let choiceLines = doc.splitTextToSize(choiceText, textWidth);
                    doc.text(choiceLines, margin, yOffset);
                    yOffset += choiceLines.length * lineHeight;
                });

                yOffset += 10;
            });

            // Salva il PDF
            doc.save('quiz_results.pdf');

            // Chiudi la finestra modale
            modal.style.display = "none";

            // Risolve la promessa, segnala che il PDF è stato generato
            resolve();
        };

        // Funzione che viene chiamata quando l'utente annulla
        cancelButton.onclick = function () {
            // Chiudi la finestra modale
            modal.style.display = "none";

            // Risolve la promessa, segnala che l'utente ha annullato
            resolve();
        };
    });
}

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', scoreText.innerText);

        // Chiedi conferma e genera il PDF
        generatePDF().then(() => {
            // Dopo la conferma o annullamento, passa alla pagina end.html
            return window.location.assign('/quizprova/end.html');
        });
        
        return;
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
