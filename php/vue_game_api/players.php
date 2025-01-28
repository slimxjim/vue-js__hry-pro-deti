<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'Players';
$columns = [
    'Name',
    'Username',
    'PasswordHash',
    'Age',
    'ClassNumber'
];

$primaryKey = 'PlayerID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>
