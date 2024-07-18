<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/hangman.php';
require_once __DIR__ . '/wordle.php';
use MongoDB\Client;
use MongoDB\Driver\ServerApi;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// MongoDB connection details

$uri = $_ENV['URI'];
$client = new Client($uri);

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['PATH_INFO'], '/'));

if (count($path) == 2) {
    if ($path[0] == 'hangman') {
        handleHangmanRequests($method, $path[1], $client);
    } elseif ($path[0] == 'wordle') {
        handleWordleRequests($method, $path[1], $client);
    } else {
        echo json_encode(['message' => 'Endpoint not found']);
    }
} else {
    echo json_encode(['message' => 'Endpoint not found']);
}

function handleHangmanRequests($method, $endpoint, $client) {
    if ($method == 'GET' && $endpoint == 'newgame') {
        newHangmanGame($client);
    } elseif ($method == 'POST' && $endpoint == 'guess') {
        makeHangmanGuess($client);
    } elseif ($method == 'GET' && $endpoint == 'leaderboard') {
        getHangmanLeaderboard($client);
    } else {
        echo json_encode(['message' => 'Endpoint not found']);
    }
}

function handleWordleRequests($method, $endpoint, $client) {
    if ($method == 'GET' && $endpoint == 'newgame') {
        newWordleGame($client);
    } elseif ($method == 'POST' && $endpoint == 'guess') {
        makeWordleGuess($client);
    } elseif ($method == 'GET' && $endpoint == 'leaderboard') {
        getWordleLeaderboard($client);
    } else {
        echo json_encode(['message' => 'Endpoint not found']);
    }
}
?>
