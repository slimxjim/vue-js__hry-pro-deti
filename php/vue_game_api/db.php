<?php
$host = 'localhost';//'localhost:3306';
$user = 'admin4calc';       // Default MySQL username
$pass = 'MaWN5q6uUuRT.8P';           // Default MySQL password /local = admin
$dbname = 'calculations';  // Your database name

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
