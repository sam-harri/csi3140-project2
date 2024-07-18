<?php
require_once __DIR__ . '/vendor/autoload.php';
use MongoDB\Client;

function newWordleGame($client) {
    $word = generateWordleWord();
    $game = [
        'word' => $word,
        'guesses' => [],
        'won' => false,
        'game_over' => false,
    ];
    $result = $client->gamehub->wordlegames->insertOne($game);
    echo json_encode(['game_id' => (string)$result->getInsertedId()]);
}

function makeWordleGuess($client) {
    $data = json_decode(file_get_contents('php://input'), true);
    $gameId = new MongoDB\BSON\ObjectId($data['game_id']);
    $inputWord = strtoupper($data['word']);

    if (strlen($inputWord) !== 5) {
        echo json_encode(['message' => 'Word must be 5 letters long']);
        return;
    }

    $game = $client->gamehub->wordlegames->findOne(['_id' => $gameId]);

    if (!$game || $game['game_over']) {
        echo json_encode(['error' => 'Invalid game or game is already over.']);
        return;
    }

    $guesses = (array)$game['guesses'];

    $evaluation = evaluateWordleGuess($game['word'], $inputWord);

    $guesses[] = ['word' => $inputWord, 'evaluation' => $evaluation];

    if ($inputWord === $game['word']) {
        $client->gamehub->wordlegames->updateOne(
            ['_id' => $gameId],
            ['$set' => ['won' => true, 'game_over' => true, 'guesses' => $guesses]]
        );
        echo json_encode([
            'won' => true,
            'finished' => true,
            'guesses' => $guesses,
            'message' => 'Congratulations! You won!'
        ]);
        return;
    }

    if (count($guesses) >= 6) {
        $client->gamehub->wordlegames->updateOne(
            ['_id' => $gameId],
            ['$set' => ['game_over' => true, 'guesses' => $guesses]]
        );
        echo json_encode([
            'won' => false,
            'finished' => true,
            'guesses' => $guesses,
            'message' => 'Game over! The word was ' . $game['word']
        ]);
        return;
    }

    $client->gamehub->wordlegames->updateOne(
        ['_id' => $gameId],
        ['$set' => ['guesses' => $guesses]]
    );

    echo json_encode([
        'won' => false,
        'finished' => false,
        'guesses' => $guesses,
        'message' => 'Keep guessing!'
    ]);
}

function getWordleLeaderboard($client) {
    $leaderboard = $client->gamehub->wordlegames->aggregate([
        ['$match' => ['won' => true]],
        ['$addFields' => ['num_guesses' => ['$size' => '$guesses']]],
        ['$sort' => ['num_guesses' => 1]]
    ])->toArray();

    $formattedLeaderboard = array_map(function($entry) {
        return [$entry['word'], count($entry['guesses'])];
    }, $leaderboard);

    echo json_encode($formattedLeaderboard);
}

$words = [
    'ARRAY', 'ASCII', 'BASIC', 'BATCH', 'BYTES', 'CACHE', 'CLASS', 'CLICK', 'CLOUD', 'CODEC',
    'CRYPT', 'DEBUG', 'DOCKER', 'FLASK', 'FRAME', 'GUARD', 'INDEX', 'INPUT', 'LABEL',
    'LAYER', 'LIMIT', 'LOGIN', 'LOOPS', 'MACRO', 'MATCH', 'MOUNT', 'NODEX',
    'PAUSE', 'PIVOT', 'PROXY', 'QUERY', 'QUEUE', 'SHIFT', 'SOLID', 'SPAWN', 'STACK', 
    'TABLE', 'TOKEN', 'TRIGG', 'UNITY', 'VISTA', 'WHILE', 'ALPHA',
    'FETCH', 'FORGE', 'PYTHON', 'REACT',
    'SCALA', 'SPARK', 'SWIFT', 'TYPES',
];


function generateWordleWord() {
    global $words;
    return $words[array_rand($words)];
}

function evaluateWordleGuess($solution, $guess) {
    $evaluation = [];
    $solutionChars = str_split($solution);
    $guessChars = str_split($guess);

    foreach ($guessChars as $index => $char) {
        if ($char === $solutionChars[$index]) {
            $evaluation[] = 'correct';
        } elseif (in_array($char, $solutionChars)) {
            $evaluation[] = 'present';
        } else {
            $evaluation[] = 'absent';
        }
    }

    return $evaluation;
}
?>
