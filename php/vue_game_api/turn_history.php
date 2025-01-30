<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'TurnHistory';
$columns = [
    'GameID',
    'OperandA',
    'Operator',
    'OperandB',
    'CorrectAnswer',
    'PlayerAnswer',
    'IsCorrect',
    'AnswerTimeFirstMs',
    'AnswerTimeTotalMs',
    'Device'
];

$primaryKey = 'TurnID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>