<?php
include 'cors_allow.php';
include 'db.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents('php://input'), true);

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
        $stmt = $conn->prepare("INSERT INTO TurnHistory (GameID, OperandA, Operator, OperandB, CorrectAnswer, PlayerAnswer, IsCorrect, AnswerTimeMs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "iisiiiii",
            $input["GameID"],
            $input["OperandA"],
            $input["Operator"],
            $input["OperandB"],
            $input["CorrectAnswer"],
            $input["PlayerAnswer"],
            $input["IsCorrect"],
            $input["AnswerTimeMs"]
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
            $stmt = $conn->prepare("UPDATE TurnHistory SET GameID = ?, OperandA = ?, Operator = ?, OperandB = ?, CorrectAnswer = ?, PlayerAnswer = ?, IsCorrect = ?, AnswerTimeMs = ? WHERE TurnID = ?");
            $stmt->bind_param(
                "iisiiiiii",
                $input["GameID"],
                $input["OperandA"],
                $input["Operator"],
                $input["OperandB"],
                $input["CorrectAnswer"],
                $input["PlayerAnswer"],
                $input["IsCorrect"],
                $input["AnswerTimeMs"],
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
              $stmt = $conn->prepare("DELETE FROM TurnHistory WHERE TurnID = ?");
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
