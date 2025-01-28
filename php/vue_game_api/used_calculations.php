<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'UsedCalculations';
$columns = [
    'OperandA',
    'Operator',
    'OperandB',
    'CorrectAnswer'
];

$primaryKey = 'CalculationID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>