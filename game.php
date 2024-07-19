<?php
session_start();

if (!isset($_SESSION['board'])) {
    resetGame();
}

function resetGame() {
    $_SESSION['board'] = array_fill(0, 20, array_fill(0, 20, ''));
    $_SESSION['currentPlayer'] = 'X';
}

function resetScores() {
    $_SESSION['scoreX'] = 0;
    $_SESSION['scoreO'] = 0;
}

function updateScore($player) {
    if ($player === 'X') {
        $_SESSION['scoreX']++;
        addWinToLeaderboard('Player X', $_SESSION['scoreX']);
    } else {
        $_SESSION['scoreO']++;
        addWinToLeaderboard('Player O', $_SESSION['scoreO']);
    }
}

function handleRequest() {
    $action = $_POST['action'] ?? '';
    switch ($action) {
        case 'resetGame':
            resetGame();
            break;
        case 'resetScores':
            resetScores();
            break;
        case 'makeMove':
            $row = (int) $_POST['row'];
            $col = (int) $_POST['col'];
            makeMove($row, $col);
            break;
        case 'getLeaderboard':
            getLeaderboard();
            return;
        default:
            // No action specified
    }

    echo json_encode([
        'board' => $_SESSION['board'],
        'currentPlayer' => $_SESSION['currentPlayer'],
        'scoreX' => $_SESSION['scoreX'],
        'scoreO' => $_SESSION['scoreO']
    ]);
}

function makeMove($row, $col) {
    if ($_SESSION['board'][$row][$col] === '') {
        $_SESSION['board'][$row][$col] = $_SESSION['currentPlayer'];
        if (checkWin($_SESSION['currentPlayer'])) {
            updateScore($_SESSION['currentPlayer']);
            resetGame();
        } else if (isDraw()) {
            resetGame();
        } else {
            $_SESSION['currentPlayer'] = $_SESSION['currentPlayer'] === 'X' ? 'O' : 'X';
        }
    }
}

function isDraw() {
    foreach ($_SESSION['board'] as $row) {
        foreach ($row as $cell) {
            if ($cell === '') {
                return false;
            }
        }
    }
    return true;
}

function checkWin($player) {
    // Check rows, columns, and diagonals for a win
    for ($i = 0; $i < 20; $i++) {
        for ($j = 0; $j < 20; $j++) {
            if (checkDirection($i, $j, 1, 0, $player) ||
                checkDirection($i, $j, 0, 1, $player) ||
                checkDirection($i, $j, 1, 1, $player) ||
                checkDirection($i, $j, 1, -1, $player)) {
                return true;
            }
        }
    }
    return false;
}

function checkDirection($row, $col, $dRow, $dCol, $player) {
    $count = 0;
    for ($i = 0; $i < 5; $i++) {
        $r = $row + $i * $dRow;
        $c = $col + $i * $dCol;
        if ($r < 0 || $r >= 20 || $c < 0 || $c >= 20 || $_SESSION['board'][$r][$c] !== $player) {
            return false;
        }
        $count++;
    }
    return $count === 5;
}

function addWinToLeaderboard($playerName, $score) {
    $leaderboard = json_decode(file_get_contents('leaderboard.json'), true) ?? [];
    $leaderboard[] = ['player' => $playerName, 'score' => $score];
    usort($leaderboard, function($a, $b) {
        return $b['score'] - $a['score'];
    });
    $leaderboard = array_slice($leaderboard, 0, 10);
    file_put_contents('leaderboard.json', json_encode($leaderboard));
}

function getLeaderboard() {
    $leaderboard = json_decode(file_get_contents('leaderboard.json'), true) ?? [];
    echo json_encode(['leaderboard' => $leaderboard]);
}

handleRequest();

