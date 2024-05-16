let board = [];
let currentPlayer = 'X';
let gameMode = 'human';
let scoreX = 0;
let scoreO = 0;

function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    resetGame();
}

function resetGame() {
    board = Array.from({ length: 5 }, () => Array(5).fill(''));
    currentPlayer = 'X';
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
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
    const winConditions = [
        // Rows
        ...board.map(row => row.every(cell => cell === player)),
        // Columns
        ...board[0].map((_, colIndex) => board.every(row => row[colIndex] === player)),
        // Diagonals
        board.every((row, rowIndex) => row[rowIndex] === player),
        board.every((row, rowIndex) => row[4 - rowIndex] === player)
    ];
    return winConditions.some(condition => condition);
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
}

resetGame();
