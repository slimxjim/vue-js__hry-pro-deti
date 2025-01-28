<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'Levels';
$columns = [
    'Type',
    'Name',
    'MinA',
    'MaxA',
    'Operator',
    'MinB',
    'MaxB',
    'MinResult',
    'MaxResult',
    'Description'
];

$primaryKey = 'LevelID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>