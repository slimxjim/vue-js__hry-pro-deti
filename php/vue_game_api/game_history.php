<?php
include 'cors_allow.php';
include 'db.php';
include 'CrudController.php';

// Konfigurace pro tabulku GameHistory
$table = 'GameHistory'; //TODO -> Game

/* NEW:
  gameId?: number
  gameType: EGameType;
  gameState: GameState;
  gameCreationTimestamp: string;
  level: CalculationLevel;
  gameScenario: Calculation[];
  player: Player; //owner
  opponent?: Player; //could be other person or PC or null (learning mode),
  */

$columns = [
    'CreationTimestamp',
    'PlayerID',
    'CurrentTurn',
    'LivesPlayer',
    'LivesOpponent',
    'TimeLimitSeconds',
    'CurrentLevelID',
    'LastExpression',
    'Device'
];
$primaryKey = 'GameID';

$controller = new CrudController($conn, $table, $columns, $primaryKey);
$controller->handleRequest();

$conn->close();
?>
