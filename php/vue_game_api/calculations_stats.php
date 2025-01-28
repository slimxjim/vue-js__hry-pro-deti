<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'CalculatingStats';
$columns = [
    'PlayerID',
    'CalculationID',
    'BestTimeMs',
    'WorstTimeMs',
    'ErrorRate',
    'TotalAttempts',
    'CorrectAttempts',
    'IncorrectAttempts'
];
$primaryKey = 'StatID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>