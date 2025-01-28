<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

$table = 'PlayerImages';
$columns = [
    'PlayerID',
    'UploadDate',
    'ImageURL',
    'LastUsedDate',
    'RevealPercentage',
    'UsageCount'
];

$primaryKey = 'ImageID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>