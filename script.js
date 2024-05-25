const gridSize = 20;
const winCondition = 5;
let board = [];
let currentPlayer = 'X';
let gameMode = 'human';
let difficulty = 'easy';
let scoreX = 0;
let scoreO = 0;
let player1Name = 'Player 1';
let player2Name = 'Player 2';
<<<<<<< HEAD
=======

function showPlayerForm() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('playerForm').style.display = 'block';
}
>>>>>>> 746573fcec2e3e542703856c9eed4ec7b49aec6c

function showPlayerForm() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('playerForm').style.display = 'block';
}

function startGame(mode, level = 'easy') {
    gameMode = mode;
    difficulty = level;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('playerForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('playerForm').style.display = 'none';
    resetGame();
}

document.getElementById('playerNamesForm').addEventListener('submit', function (event) {
    event.preventDefault();
    player1Name = document.getElementById('player1Name').value;
    player2Name = document.getElementById('player2Name').value;
    document.getElementById('player1Label').innerText = player1Name;
    document.getElementById('player2Label').innerText = player2Name;
    startGame('human');
});

function resetGame() {
    board = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    currentPlayer = 'X';
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.innerText = board[i][j];
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    if (board[row][col] === '') {
        board[row][col] = currentPlayer;
        if (checkWin(currentPlayer)) {
            alert(`${currentPlayer} wins!`);
            updateScore(currentPlayer);
            resetGame();
        } else if (isDraw()) {
            alert('Draw!');
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (gameMode === 'ai' && currentPlayer === 'O') {
                aiMove();
            }
        }
        renderBoard();
    }
}

function isDraw() {
    return board.flat().every(cell => cell !== '');
}

function checkWin(player) {
    const checkDirection = (row, col, deltaRow, deltaCol) => {
        let count = 0;
        for (let i = 0; i < winCondition; i++) {
            const newRow = row + i * deltaRow;
            const newCol = col + i * deltaCol;
            if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize || board[newRow][newCol] !== player) {
                return false;
            }
            count++;
        }
        return count === winCondition;
    };

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === player) {
                if (
                    checkDirection(i, j, 1, 0) ||  // Check row
                    checkDirection(i, j, 0, 1) ||  // Check column
                    checkDirection(i, j, 1, 1) ||  // Check diagonal
                    checkDirection(i, j, 1, -1)    // Check anti-diagonal
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function aiMove() {
    switch (difficulty) {
        case 'easy':
            makeRandomMove('easy');
            break;
        case 'medium':
            if (!blockPlayerWin()) {
                makeRandomMove('medium');
            }
            break;
        case 'hard':
            if (!tryToWin() && !blockPlayerWin(true)) {
                makeStrategicMove();
            }
            break;
    }
    if (checkWin('O')) {
        alert('O wins!');
        updateScore('O');
        resetGame();
    } else if (isDraw()) {
        alert('Draw!');
        resetGame();
    } else {
        currentPlayer = 'X';
    }
    renderBoard();
}

function makeRandomMove(level) {
    const emptyCells = board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (cell === '' ? { rowIndex, colIndex } : null))
    ).filter(cell => cell !== null);

    if (emptyCells.length > 0) {
        const { rowIndex, colIndex } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[rowIndex][colIndex] = 'O';
    }
}

function makeStrategicMove() {
    const emptyCells = board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (cell === '' ? { rowIndex, colIndex } : null))
    ).filter(cell => cell !== null);

    if (emptyCells.length > 0) {
        // Prioritize center, then corners, then random
        const centerCells = emptyCells.filter(cell => Math.abs(cell.rowIndex - gridSize / 2) < gridSize / 4 && Math.abs(cell.colIndex - gridSize / 2) < gridSize / 4);
        const cornerCells = emptyCells.filter(cell =>
            (cell.rowIndex === 0 || cell.rowIndex === gridSize - 1) &&
            (cell.colIndex === 0 || cell.colIndex === gridSize - 1)
        );
        let targetCells = centerCells.length ? centerCells : cornerCells.length ? cornerCells : emptyCells;
        const { rowIndex, colIndex } = targetCells[Math.floor(Math.random() * targetCells.length)];
        board[rowIndex][colIndex] = 'O';
    }
}

function blockPlayerWin(hardMode = false) {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'X';
                if (checkWin('X')) {
                    board[i][j] = 'O';
                    return true;
                }
                board[i][j] = '';
            }
        }
    }
    if (hardMode) {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (board[i][j] === '' && detectThreeInARow('X', i, j)) {
                    board[i][j] = 'O';
                    return true;
                }
            }
        }
    }
    return false;
}

function detectThreeInARow(player, row, col) {
    const directions = [
        { deltaRow: 1, deltaCol: 0 },
        { deltaRow: 0, deltaCol: 1 },
        { deltaRow: 1, deltaCol: 1 },
        { deltaRow: 1, deltaCol: -1 }
    ];

    for (const { deltaRow, deltaCol } of directions) {
        let count = 0;
        for (let i = -3; i <= 3; i++) {
            const newRow = row + i * deltaRow;
            const newCol = col + i * deltaCol;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                if (board[newRow][newCol] === player) {
                    count++;
                } else if (board[newRow][newCol] === '' && count === 3) {
                    return true;
                } else {
                    count = 0;
                }
            }
        }
    }
    return false;
}

function tryToWin() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'O';
                if (checkWin('O')) {
                    return true;
                }
                board[i][j] = '';
            }
        }
    }
    return false;
}

function updateScore(player) {
    if (player === 'X') {
        scoreX++;
        document.getElementById('scoreX').innerText = scoreX;
    } else {
        scoreO++;
        document.getElementById('scoreO').innerText = scoreO;
    }
}

function resetScores() {
    scoreX = 0;
    scoreO = 0;
    document.getElementById('scoreX').innerText = scoreX;
    document.getElementById('scoreO').innerText = scoreO;
}

function backToMenu() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('playerForm').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', (event) => {
    resetGame();
});
