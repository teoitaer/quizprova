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








function generatePDF(quizResults) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margin = 20;
    const textWidth = doc.internal.pageSize.width - 2 * margin;
    const lineHeight = 8;
    const maxY = 280;
    let yOffset = 20;

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
                doc.setTextColor(0, 128, 0); // Verde per risposte corrette
            } else if (questionData.selectedAnswer == (i + 1) && questionData.correctAnswer != (i + 1)) {
                doc.setTextColor(255, 0, 0); // Rosso per risposte sbagliate
            } else {
                doc.setTextColor(0, 0, 0); // Nero per altre risposte
            }

            let choiceLines = doc.splitTextToSize(choiceText, textWidth);
            doc.text(choiceLines, margin, yOffset);
            yOffset += choiceLines.length * lineHeight;
        });

        yOffset += 10;
    });

    doc.save('quiz_results.pdf');
