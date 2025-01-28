<?php
include 'cors_allow.php';
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        // Retrieve records
        //PHP 7.0: $id = $_GET['id'] ?? null;
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM Players WHERE PlayerID = ?");
            $stmt->bind_param("i", $id);
        } else {
            $stmt = $conn->prepare("SELECT * FROM Players");
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
        break;

    case 'POST':
        // Insert a new record
        $stmt = $conn->prepare("INSERT INTO Players (Name, Username, PasswordHash, Age, ClassNumber) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssssi",
            $input['Name'],
            $input['Username'],
            $input['PasswordHash'],
            $input['Age'],
            $input['ClassNumber']
        );
        if ($stmt->execute()) {
            echo json_encode(["id" => $conn->insert_id]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => $stmt->error]);
        }
        break;

    case 'PUT':
        // Update an existing record
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("UPDATE Players SET Name = ?, Username = ?, PasswordHash = ?, Age = ?, ClassNumber = ? WHERE PlayerID = ?");
            $stmt->bind_param(
                "ssssii",
                $input['Name'],
                $input['Username'],
                $input['PasswordHash'],
                $input['Age'],
                $input['ClassNumber'],
                $id
            );
            if ($stmt->execute()) {
                echo json_encode(["message" => "Record updated"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => $stmt->error]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "ID is required for updating"]);
        }
        break;

    case 'DELETE':
        // Delete a record
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("DELETE FROM Players WHERE PlayerID = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Record deleted"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => $stmt->error]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "ID is required for deletion"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

$conn->close();
?>
