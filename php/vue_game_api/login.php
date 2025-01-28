<?php
include 'cors_allow.php';
include 'db.php';

// Read raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if the data is valid
if (isset($data['username'], $data['password'])) {
    $username = $data['username'];
    $password = $data['password'];

    // Prepare the SQL statement to retrieve the user by username
    $stmt = $conn->prepare("SELECT * FROM Players WHERE Username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify the password against the stored hash
        if (password_verify($password, $user['PasswordHash'])) {
            // Successful login
            echo json_encode(["message" => "Login successful", "player" => $user]);
        } else {
            // Invalid password
            echo json_encode(["message" => "Invalid credentials"]);
        }
    } else {
        // Username not found
        echo json_encode(["message" => "User not found"]);
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["message" => "Invalid input data"]);
}
?>
