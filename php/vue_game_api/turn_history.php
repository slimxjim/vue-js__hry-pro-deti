<?php
include 'cors_allow.php';
include 'db.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case "GET":
        if (isset($_GET["id"])) {
            $stmt = $conn->prepare("SELECT * FROM TurnHistory WHERE TurnID = ?");
            $stmt->bind_param("i", $_GET["id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_assoc());
        } else {
            $result = $conn->query("SELECT * FROM TurnHistory");
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        }
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO TurnHistory (GameID, OperandA, Operator, OperandB, CorrectAnswer, PlayerAnswer, IsCorrect, AnswerTimeMs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "iisiiibi",
            $data["GameID"],
            $data["OperandA"],
            $data["Operator"],
            $data["OperandB"],
            $data["CorrectAnswer"],
            $data["PlayerAnswer"],
            $data["IsCorrect"],
            $data["AnswerTimeMs"]
        );
        $stmt->execute();
        echo json_encode(["TurnID" => $stmt->insert_id]);
        break;

    case "PUT":
        parse_str(file_get_contents("php://input"), $data);
        $stmt = $conn->prepare("UPDATE TurnHistory SET GameID = ?, OperandA = ?, Operator = ?, OperandB = ?, CorrectAnswer = ?, PlayerAnswer = ?, IsCorrect = ?, AnswerTimeMs = ? WHERE TurnID = ?");
        $stmt->bind_param(
            "iisiiibii",
            $data["GameID"],
            $data["OperandA"],
            $data["Operator"],
            $data["OperandB"],
            $data["CorrectAnswer"],
            $data["PlayerAnswer"],
            $data["IsCorrect"],
            $data["AnswerTimeMs"],
            $data["TurnID"]
        );
        $stmt->execute();
        echo json_encode(["updated" => $stmt->affected_rows]);
        break;

    case "DELETE":
        if (isset($_GET["id"])) {
            $stmt = $conn->prepare("DELETE FROM TurnHistory WHERE TurnID = ?");
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
