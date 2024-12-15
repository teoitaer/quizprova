const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 10;

finalScore.innerText = mostRecentScore;

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








function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Impostare margini più stretti
    const margin = 20; // Margine più stretto
    const textWidth = doc.internal.pageSize.width - 2 * margin; // Larghezza disponibile per il testo
    const lineHeight = 8; // Altezza di una riga di testo più piccola
    const maxY = 280; // Altezza massima prima di andare a capo (per evitare sovrapposizioni)
    let yOffset = 20; // Distanza iniziale dall'alto della pagina

    // Imposta il carattere più piccolo
    doc.setFontSize(8); // Dimensione del carattere più piccola

    quizResults.forEach((questionData, index) => {
        // Verifica se abbiamo spazio per aggiungere la domanda corrente, altrimenti aggiungi una nuova pagina
        if (yOffset + (questionData.choices.length + 1) * lineHeight > maxY) {
            doc.addPage();
            yOffset = 20; // Reset yOffset per la nuova pagina
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

            // Impostiamo il colore in base alla risposta
            if (questionData.selectedAnswer == (i + 1) && questionData.correctAnswer == (i + 1)) {
                // Risposta corretta -> verde
                doc.setTextColor(0, 128, 0); // Verde
            } else if (questionData.selectedAnswer == (i + 1) && questionData.correctAnswer != (i + 1)) {
                // Risposta sbagliata -> rosso
                doc.setTextColor(255, 0, 0); // Rosso
            } else {
                // Risposta non selezionata o non evidenziata -> nero
                doc.setTextColor(0, 0, 0); // Nero
            }

            let choiceLines = doc.splitTextToSize(choiceText, textWidth);
            doc.text(choiceLines, margin, yOffset);
            yOffset += choiceLines.length * lineHeight; // Aumenta l'offset in base al numero di righe
        });

        yOffset += 10; // Spazio extra tra le domande
    });

    // salva automaticamente il PDF
   // doc.save('quiz_results.pdf');

     // Restituisce il documento PDF
    return doc;
}
