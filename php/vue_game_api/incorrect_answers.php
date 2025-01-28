<?php
include 'cors_allow.php';
include 'db.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case "GET":
        if (isset($_GET["id"])) {
            $stmt = $conn->prepare("SELECT * FROM IncorrectAnswers WHERE ErrorID = ?");
            $stmt->bind_param("i", $_GET["id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_assoc());
        } else {
            $result = $conn->query("SELECT * FROM IncorrectAnswers");
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        }
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO IncorrectAnswers (PlayerID, OperandA, Operator, OperandB, CorrectAnswer, PlayerAnswer, AnswerTimeMs, LevelID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "iisiisii",
            $data["PlayerID"],
            $data["OperandA"],
            $data["Operator"],
            $data["OperandB"],
            $data["CorrectAnswer"],
            $data["PlayerAnswer"],
            $data["AnswerTimeMs"],
            $data["LevelID"]
        );
        $stmt->execute();
        echo json_encode(["ErrorID" => $stmt->insert_id]);
        break;

    case "PUT":
        parse_str(file_get_contents("php://input"), $data);
        $stmt = $conn->prepare("UPDATE IncorrectAnswers SET PlayerID = ?, OperandA = ?, Operator = ?, OperandB = ?, CorrectAnswer = ?, PlayerAnswer = ?, AnswerTimeMs = ?, LevelID = ? WHERE ErrorID = ?");
        $stmt->bind_param(
            "iisiisiii",
            $data["PlayerID"],
            $data["OperandA"],
            $data["Operator"],
            $data["OperandB"],
            $data["CorrectAnswer"],
            $data["PlayerAnswer"],
            $data["AnswerTimeMs"],
            $data["LevelID"],
            $data["ErrorID"]
        );
        $stmt->execute();
        echo json_encode(["updated" => $stmt->affected_rows]);
        break;

    case "DELETE":
        if (isset($_GET["id"])) {
            $stmt = $conn->prepare("DELETE FROM IncorrectAnswers WHERE ErrorID = ?");
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
