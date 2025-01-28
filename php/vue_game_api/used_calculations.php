<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'UsedExamples';
$columns = [
    'OperandA',
    'Operator',
    'OperandB',
    'CorrectAnswer'
];

$primaryKey = 'ExampleID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>