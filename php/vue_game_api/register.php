<?php
include 'db.php';
include 'cors_allow.php';

// Read raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if the data is valid
if (isset($data['name'], $data['username'], $data['password'], $data['age'], $data['classNumber'])) {
    $name = $data['name'];
    $username = $data['username'];
    $password = $data['password'];
    $age = $data['age'];
    $classNumber = $data['classNumber'];

    // Password hashing
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO Players (Name, Username, PasswordHash, Age, ClassNumber) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $name, $username, $passwordHash, $age, $classNumber);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Registration successful"]);
    } else {
        echo json_encode(["message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["message" => "Invalid input data"]);
}
?>
