<?php
include 'cors_allow.php';
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        // Retrieve records
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM PlayerImages WHERE ImageID = ?");
            $stmt->bind_param("i", $id);
        } else {
            $stmt = $conn->prepare("SELECT * FROM PlayerImages");
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
        break;

    case 'POST':
        // Insert a new record
        $stmt = $conn->prepare("INSERT INTO PlayerImages (PlayerID, UploadDate, ImageURL, LastUsedDate, RevealPercentage, UsageCount) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "isssdii",
            $input['PlayerID'],
            $input['UploadDate'],
            $input['ImageURL'],
            $input['LastUsedDate'],
            $input['RevealPercentage'],
            $input['UsageCount']
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
            $stmt = $conn->prepare("UPDATE PlayerImages SET PlayerID = ?, UploadDate = ?, ImageURL = ?, LastUsedDate = ?, RevealPercentage = ?, UsageCount = ? WHERE ImageID = ?");
            $stmt->bind_param(
                "isssdii",
                $input['PlayerID'],
                $input['UploadDate'],
                $input['ImageURL'],
                $input['LastUsedDate'],
                $input['RevealPercentage'],
                $input['UsageCount'],
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
            $stmt = $conn->prepare("DELETE FROM PlayerImages WHERE ImageID = ?");
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
