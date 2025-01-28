<?php
include 'cors_allow.php';
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        // Retrieve records
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM Levels WHERE LevelID = ?");
            $stmt->bind_param("i", $id);
        } else {
            $stmt = $conn->prepare("SELECT * FROM Levels");
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
        break;

    case 'POST':
        // Insert a new record
        $stmt = $conn->prepare("INSERT INTO Levels (Type, Name, MinA, MaxA, Operator, MinB, MaxB, MinResult, MaxResult, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssiiisiiis",
            $input['Type'],
            $input['Name'],
            $input['MinA'],
            $input['MaxA'],
            $input['Operator'],
            $input['MinB'],
            $input['MaxB'],
            $input['MinResult'],
            $input['MaxResult'],
            $input['Description']
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
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id) {
            $stmt = $conn->prepare("UPDATE Levels SET Type = ?, Name = ?, MinA = ?, MaxA = ?, Operator = ?, MinB = ?, MaxB = ?, MinResult = ?, MaxResult = ?, Description = ? WHERE LevelID = ?");
            $stmt->bind_param(
                "ssiissiiisi",
                $input['Type'],
                $input['Name'],
                $input['MinA'],
                $input['MaxA'],
                $input['Operator'],
                $input['MinB'],
                $input['MaxB'],
                $input['MinResult'],
                $input['MaxResult'],
                $input['Description'],
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
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id) {
            $stmt = $conn->prepare("DELETE FROM Levels WHERE LevelID = ?");
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
