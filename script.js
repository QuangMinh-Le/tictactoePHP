const gridSize = 20;

function sendRequest(action, data = {}) {
    data.action = action;
    return fetch('game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    }).then(response => response.json());
}

function showPlayerForm() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('playerForm').style.display = 'block';
}

function startGame(mode, level = 'easy') {
    gameMode = mode;
    difficulty = level;

    // Reset scores and player names
    sendRequest('resetScores').then(updateUI);

    if (mode === 'human') {
        document.getElementById('playerForm').style.display = 'block';
        document.getElementById('menu').style.display = 'none';
        document.getElementById('game').style.display = 'none';
    } else {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        document.getElementById('playerForm').style.display = 'none';
        resetGame();
    }
}

document.getElementById('playerNamesForm').addEventListener('submit', function (event) {
    event.preventDefault();
    player1Name = document.getElementById('player1Name').value;
    player2Name = document.getElementById('player2Name').value;
    document.getElementById('player1Label').innerText = player1Name;
    document.getElementById('player2Label').innerText = player2Name;
    document.getElementById('playerForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    resetGame();
});

function resetGame() {
    sendRequest('resetGame').then(updateUI);
}

function renderBoard(board) {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
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
    sendRequest('makeMove', { row, col }).then(data => {
        console.log(data);
        if (data.scoreO > data.scoreX) {
            showNotification('Player O is taking the lead!');
        } else if (data.scoreO < data.scoreX) {
            showNotification('Player X is taking the lead!');
        }
        updateUI(data);
    });
}

function updateUI(state) {
    renderBoard(state.board);
    document.getElementById('scoreX').innerText = state.scoreX;
    document.getElementById('scoreO').innerText = state.scoreO;
    updateLeaderboard();
}

function resetScores() {
    sendRequest('resetScores').then(updateUI);
}

function backToMenu() {
    sendRequest('resetScores').then(() => {
        document.getElementById('game').style.display = 'none';
        document.getElementById('playerForm').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function updateLeaderboard() {
    sendRequest('getLeaderboard').then(data => {
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';
        data.leaderboard.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.innerText = `${entry.player}: ${entry.score}`;
            leaderboardList.appendChild(listItem);
        });
    });
}
