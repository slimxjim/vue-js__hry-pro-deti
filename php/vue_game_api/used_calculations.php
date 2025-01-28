<?php
include 'cors_allow.php';
include 'db.php';
//TODO Examples renames to Calculations (in DB, PHP, VueJS)
$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case "GET":
        if (isset($_GET["id"])) {
            $stmt = $conn->prepare("SELECT * FROM UsedExamples WHERE ExampleID = ?");
            $stmt->bind_param("i", $_GET["id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_assoc());
        } else {
            $result = $conn->query("SELECT * FROM UsedExamples");
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        }
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO UsedExamples (OperandA, Operator, OperandB, CorrectAnswer) VALUES (?, ?, ?, ?)");
        $stmt->bind_param(
            "isii",
            $data["OperandA"],
            $data["Operator"],
            $data["OperandB"],
            $data["CorrectAnswer"]
        );
        $stmt->execute();
        echo json_encode(["ExampleID" => $stmt->insert_id]);
        break;

    case "PUT":
        parse_str(file_get_contents("php://input"), $data);
        $stmt = $conn->prepare("UPDATE UsedExamples SET OperandA = ?, Operator = ?, OperandB = ?, CorrectAnswer = ? WHERE ExampleID = ?");
        $stmt->bind_param(
            "isiii",
            $data["OperandA"],
            $data["Operator"],
            $data["OperandB"],
            $data["CorrectAnswer"],
            $data["ExampleID"]
        );
        $stmt->execute();
        echo json_encode(["updated" => $stmt->affected_rows]);
        break;

    case "DELETE":
        if (isset($_GET["id"])) {
            $stmt = $conn->prepare("DELETE FROM UsedExamples WHERE ExampleID = ?");
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
