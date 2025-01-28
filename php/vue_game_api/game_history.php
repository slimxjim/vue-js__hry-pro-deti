<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

// Konfigurace pro tabulku GameHistory
$table = 'GameHistory';
$columns = [
    'CreationTimestamp',
    'PlayerID',
    'CurrentTurn',
    'LivesPlayer',
    'LivesOpponent',
    'TimeLimitSeconds',
    'CurrentLevelID',
    'LastExpression'
];
$primaryKey = 'GameID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>