<?php
class CrudController {
    private $conn;
    private $table;
    private $columns;
    private $primaryKey;

    public function __construct($conn, $table, $columns, $primaryKey = 'id') {
        $this->conn = $conn;
        $this->table = $table;
        $this->columns = $columns;
        $this->primaryKey = $primaryKey;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $input = json_decode(file_get_contents('php://input'), true);

        switch ($method) {
            case 'GET':
                $this->get($input);
                break;
            case 'POST':
                $this->create($input);
                break;
            case 'PUT':
                $this->update($input);
                break;
            case 'DELETE':
                $this->delete($input);
                break;
            default:
                http_response_code(405);
                echo json_encode(["error" => "Method not allowed"]);
                break;
        }
    }

    private function get($input) {
        if (isset($_GET["id"])) {
            $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?");
            $stmt->bind_param("i", (int)$_GET["id"]);
        } else {
            $stmt = $this->conn->prepare("SELECT * FROM {$this->table}");
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
    }

    private function create($input) {
        $columns = implode(", ", $this->columns);
        $placeholders = implode(", ", array_fill(0, count($this->columns), "?"));
        $types = $this->getParamTypes($input);

        $stmt = $this->conn->prepare("INSERT INTO {$this->table} ($columns) VALUES ($placeholders)");
        $stmt->bind_param($types, ...array_values($input));
        if ($stmt->execute()) {
            echo json_encode(["id" => $this->conn->insert_id]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => $stmt->error]);
        }
    }

    private function update($input) {
      // Ujistíme se, že ID je poskytnuto v URL
      if (isset($_GET["id"])) {
          // Sestavení části SQL pro SET s běžnou anonymní funkcí
          $set = implode(", ", array_map(function($col) {
              return "$col = ?";
          }, $this->columns));
  
          // Určujeme datové typy pro bind_param
          $types = $this->getParamTypes($input) . "i"; // Přidáme typ pro ID
          // echo(" - types = ".print_r($types)." | ");

          // Připravíme hodnoty pro bind_param
          $values = array_values($input); // Hodnoty pro sloupce
          $values[] = (int)$_GET["id"]; // Přidáme ID na konec
  
          // Připravíme SQL dotaz pro UPDATE
          $updateQuery = "UPDATE {$this->table} SET $set WHERE {$this->primaryKey} = ?";
          //echo("updateQuery = " . $updateQuery . "<br>\n");
          $stmt = $this->conn->prepare($updateQuery);
          //$input = $this->prepareValues($input);
          //echo("input ".print_r($input)." \n <br> \n prepareValues ".print_r($this->prepareValues($values)));
          // Spojíme typy a hodnoty pro bind_param
          $bindParams = array_merge([$types], $this->prepareValues($values));
          
          // Provádíme bind_param s rozbalením pole
          // echo(" - bindParams = ".print_r($bindParams)." >>> ");
          $stmt->bind_param(...$bindParams);
  
          // Provedeme dotaz
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
    }

    private function delete($input) {
        if (isset($_GET["id"])) {
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?");
            $stmt->bind_param("i", (int)$_GET["id"]);
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
    }

    private function getParamTypes($input) {
        // Generate types based on input values (s = string, i = integer, d = double)
        return implode("", array_map(function ($value) {
            if (is_int($value)) return 'i';
            if (is_double($value)) return 'd';
            return 's';
        }, $input));
    }

    private function prepareValues($input) {
      $arr = $input;
      foreach ($arr as $key => $value) {
          if (is_bool($value)) {
              $arr[$key] = (int) $value;
          }
      }
      return $arr;
  }
}
?>
