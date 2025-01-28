<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'ExampleStats';
$columns = [
    'PlayerID',
    'ExampleID',
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