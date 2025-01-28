<?php
include 'cors_allow.php';
include 'db.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case "GET":
        if (isset($_GET["id"])) {
            $stmt = $conn->prepare("SELECT * FROM ExampleStats WHERE StatID = ?");
            $stmt->bind_param("i", $_GET["id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_assoc());
        } else {
            $result = $conn->query("SELECT * FROM ExampleStats");
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        }
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO ExampleStats (PlayerID, ExampleID, BestTimeMs, WorstTimeMs, ErrorRate, TotalAttempts, CorrectAttempts, IncorrectAttempts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "iiidiiii",
            $data["PlayerID"],
            $data["ExampleID"],
            $data["BestTimeMs"],
            $data["WorstTimeMs"],
            $data["ErrorRate"],
            $data["TotalAttempts"],
            $data["CorrectAttempts"],
            $data["IncorrectAttempts"]
        );
        $stmt->execute();
        echo json_encode(["StatID" => $stmt->insert_id]);
        break;

    case "PUT":
        parse_str(file_get_contents("php://input"), $data);
        $stmt = $conn->prepare("UPDATE ExampleStats SET PlayerID = ?, ExampleID = ?, BestTimeMs = ?, WorstTimeMs = ?, ErrorRate = ?, TotalAttempts = ?, CorrectAttempts = ?, IncorrectAttempts = ? WHERE StatID = ?");
        $stmt->bind_param(
            "iiidiiiii",
            $data["PlayerID"],
            $data["ExampleID"],
            $data["BestTimeMs"],
            $data["WorstTimeMs"],
            $data["ErrorRate"],
            $data["TotalAttempts"],
            $data["CorrectAttempts"],
            $data["IncorrectAttempts"],
            $data["StatID"]
        );
        $stmt->execute();
        echo json_encode(["updated" => $stmt->affected_rows]);
        break;

    case "DELETE":
        if (isset($_GET["id"])) {
            $stmt = $conn->prepare("DELETE FROM ExampleStats WHERE StatID = ?");
            $stmt->bind_param("i", $_GET["id"]);
            $stmt->execute();
            echo json_encode(["deleted" => $stmt->affected_rows]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid request method"]);
        break;
}

$conn->close();
?>
