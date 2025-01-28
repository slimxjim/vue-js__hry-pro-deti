<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'IncorrectAnswers';
$columns = [
    'PlayerID',
    'OperandA',
    'Operator',
    'OperandB',
    'CorrectAnswer',
    'PlayerAnswer',
    'AnswerTimeMs',
    'LevelID'
];

$primaryKey = 'ErrorID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>