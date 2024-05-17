const gridSize = 20;
const winCondition = 5;
let board = [];
let currentPlayer = 'X';
let gameMode = 'human';
let scoreX = 0;
let scoreO = 0;
let player1Name = 'Player 1';
let player2Name = 'Player 2';

function showPlayerForm() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('playerForm').style.display = 'block';
}

function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('playerForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
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
    const emptyCells = board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (cell === '' ? { rowIndex, colIndex } : null))
    ).filter(cell => cell !== null);

    if (emptyCells.length > 0) {
        const { rowIndex, colIndex } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[rowIndex][colIndex] = 'O';
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
