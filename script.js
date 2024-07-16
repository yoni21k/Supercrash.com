let moves = [];
let predictionThreshold = 16;
let predictions = [];
let safeCells = [];
let winCount = 0;
let loseCount = 0;

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', function() {
        let cellIndex = parseInt(this.id.split('-')[1]);
        if (moves.length < predictionThreshold) {
            toggleMine(cellIndex);
        } else if (this.classList.contains('prediction')) {
            markMistake(cellIndex);
        }
    });
});

document.getElementById('predictButton').addEventListener('click', function() {
    if (moves.length === predictionThreshold) {
        predictions = predictMines();
        highlightPredictions(predictions);
        document.getElementById('result').textContent = 'Predicción realizada';
    } else {
        document.getElementById('result').textContent = 'Debes marcar exactamente ' + predictionThreshold + ' celdas.';
    }
});

document.getElementById('newGameButton').addEventListener('click', function() {
    let minesToAvoid = parseInt(document.getElementById('minesToAvoid').value);
    resetGame();
    highlightPredictions(predictMines());
    highlightMinesToAvoid(minesToAvoid);
    document.getElementById('result').textContent = 'Nueva partida iniciada con predicciones';
});

document.getElementById('winButton').addEventListener('click', function() {
    winCount++;
    updateEffectivenessMeter();
});

document.getElementById('loseButton').addEventListener('click', function() {
    loseCount++;
    updateEffectivenessMeter();
});

function toggleMine(index) {
    let cell = document.getElementById(`cell-${index}`);
    if (cell.classList.contains('mine')) {
        cell.classList.remove('mine');
        moves = moves.filter(move => move !== index);
    } else {
        cell.classList.add('mine');
        moves.push(index);
    }
}

function predictMines() {
    let totalCells = 25;
    let safeCellsCount = 3;
    let predictions = [];
    while (predictions.length < safeCellsCount) {
        let prediction = Math.floor(Math.random() * totalCells);
        if (!moves.includes(prediction) && !predictions.includes(prediction)) {
            predictions.push(prediction);
        }
    }
    return predictions;
}

function highlightPredictions(predictions) {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('prediction', 'safe', 'mistake'));
    predictions.forEach(prediction => {
        document.getElementById(`cell-${prediction}`).classList.add('prediction');
    });
}

function highlightMinesToAvoid(minesToAvoid) {
    let totalCells = 25;
    let mines = [];
    while (mines.length < minesToAvoid) {
        let mine = Math.floor(Math.random() * totalCells);
        if (!moves.includes(mine) && !predictions.includes(mine) && !mines.includes(mine)) {
            mines.push(mine);
        }
    }
    mines.forEach(mine => {
        document.getElementById(`cell-${mine}`).classList.add('mine-to-avoid');
    });
}

function resetGame() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('mine', 'prediction', 'safe', 'mistake', 'mine-to-avoid');
    });
    moves = [];
}

function markMistake(index) {
    let cell = document.getElementById(`cell-${index}`);
    if (cell.classList.contains('prediction')) {
        cell.classList.remove('prediction');
        cell.classList.add('mistake');
    }
}

function updateEffectivenessMeter() {
    let total = winCount + loseCount;
    let winPercentage = total > 0 ? (winCount / total) * 100 : 0;
    let losePercentage = total > 0 ? (loseCount / total) * 100 : 0;

    document.getElementById('winPercentage').style.width = winPercentage + '%';
    document.getElementById('losePercentage').style.width = losePercentage + '%';

    document.getElementById('winPercentage').textContent = winPercentage.toFixed(1) + '%';
    document.getElementById('losePercentage').textContent = losePercentage.toFixed(1) + '%';
}