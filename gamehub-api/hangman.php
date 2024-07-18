<?php
require_once __DIR__ . '/vendor/autoload.php';
use MongoDB\Client;

function newHangmanGame($client) {
    $word = generateHangmanWord();
    $game = [
        'word' => $word,
        'guessed_letters' => [],
        'incorrect_guesses' => [],
        'won' => false,
        'game_over' => false,
    ];
    $result = $client->gamehub->hangmangames->insertOne($game);
    echo json_encode(['game_id' => (string)$result->getInsertedId(), 'word_length' => strlen($word)]);
}

function makeHangmanGuess($client) {
    $data = json_decode(file_get_contents('php://input'), true);
    $gameId = new MongoDB\BSON\ObjectId($data['game_id']);
    $letter = strtoupper($data['letter']);

    $game = $client->gamehub->hangmangames->findOne(['_id' => $gameId]);

    if (!$game || $game['game_over']) {
        echo json_encode(['error' => 'Invalid game or game is already over.']);
        return;
    }

    $guessedLetters = (array)$game['guessed_letters'];
    $incorrectGuesses = (array)$game['incorrect_guesses'];

    if (in_array($letter, $guessedLetters) || in_array($letter, $incorrectGuesses)) {
        echo json_encode([
            'won' => false,
            'finished' => false,
            'game' => generateStateArray($game['word'], $guessedLetters),
            "num_incorrect" => count($incorrectGuesses),
            'message' => 'Letter already guessed!'
        ]);
        return;
    }

    $message = '';

    if (strpos($game['word'], $letter) !== false) {
        $client->gamehub->hangmangames->updateOne(
            ['_id' => $gameId],
            ['$push' => ['guessed_letters' => $letter]]
        );
        $guessedLetters[] = $letter;
        $message = 'Correct guess!';
    } else {
        $client->gamehub->hangmangames->updateOne(
            ['_id' => $gameId],
            ['$push' => ['incorrect_guesses' => $letter]]
        );
        $incorrectGuesses[] = $letter;
        $message = 'Incorrect guess!';
    }

    if (count($incorrectGuesses) >= 6) {
        $client->gamehub->hangmangames->updateOne(
            ['_id' => $gameId],
            ['$set' => ['game_over' => true]]
        );
        echo json_encode([
            'won' => false,
            'finished' => true,
            'game' => generateStateArray($game['word'], $guessedLetters),
            "num_incorrect" => count($incorrectGuesses),
            'message' => 'Incorrect Guess! Game over! The word was ' . $game['word']
        ]);
        return;
    }

    if (checkWin($game['word'], $guessedLetters)) {
        $client->gamehub->hangmangames->updateOne(
            ['_id' => $gameId],
            ['$set' => ['won' => true, 'game_over' => true]]
        );
        echo json_encode([
            'won' => true, 
            'finished' => true,
            'game' => generateStateArray($game['word'], $guessedLetters),
            "num_incorrect" => count($incorrectGuesses),
            'message' => 'Correct Guess! Congratulations! You won!'
        ]);
        return;
    }

    echo json_encode([
        'won' => false,
        'finished' => false,
        'game' => generateStateArray($game['word'], $guessedLetters),
        "num_incorrect" => count($incorrectGuesses),
        'message' => $message
    ]);
}

function getHangmanLeaderboard($client) {
    $pipeline = [
        ['$match' => ['won' => true]],
        ['$addFields' => ['num_incorrect_guesses' => ['$size' => '$incorrect_guesses']]],
        ['$sort' => ['num_incorrect_guesses' => 1]],
        ['$limit' => 10],
        ['$project' => ['word' => 1, 'num_incorrect_guesses' => 1]]
    ];

    $leaderboard = $client->gamehub->hangmangames->aggregate($pipeline)->toArray();

    $formattedLeaderboard = array_map(function($entry) {
        return [$entry['word'], $entry['num_incorrect_guesses']];
    }, $leaderboard);

    echo json_encode($formattedLeaderboard);
}


$words = [
    'EXAMPLE', 'HANGMAN', 'COMPUTER', 'PROGRAMMING', 'DEVELOPER', 
    'DATABASE', 'FUNCTION', 'VARIABLE', 'ALGORITHM', 'NETWORK',
    'INTERNET', 'COMPILER', 'SOFTWARE', 'HARDWARE', 'ENCRYPTION',
    'PROTOCOL', 'SECURITY', 'INTERFACE', 'KERNEL', 'MEMORY',
    'PROCESSOR', 'SERVER', 'CLIENT', 'DEBUGGING', 'VERSION',
    'FRAMEWORK', 'LIBRARY', 'OBJECT', 'METHOD', 'CLASS',
    'INSTANCE', 'ATTRIBUTE', 'PARAMETER', 'ARGUMENT', 'SYNTAX',
    'THREAD', 'PROCESS', 'APPLICATION', 'VIRTUALIZATION', 'CACHE',
    'OPTIMIZATION', 'RECURSION', 'ITERATION', 'SCRIPT', 'MARKUP',
    'STYLE', 'ELEMENT', 'ATTRIBUTE', 'RELATIONAL', 'NONRELATIONAL',
    'SCALABILITY', 'LATENCY', 'THROUGHPUT', 'BANDWIDTH', 'CONCURRENCY',
    'PARALLELISM', 'DISTRIBUTION', 'MIGRATION', 'DEPLOYMENT', 'CONTINUOUS'
];

function generateHangmanWord() {
    global $words;
    return $words[array_rand($words)];
}

function generateStateArray($word, $guessedLetters) {
    return array_map(function($letter) use ($guessedLetters) {
        return in_array($letter, $guessedLetters) ? $letter : "";
    }, str_split($word));
}

function checkWin($word, $guessed_letters) {
    foreach (str_split($word) as $letter) {
        if (!in_array($letter, $guessed_letters)) {
            return false;
        }
    }
    return true;
}
?>
