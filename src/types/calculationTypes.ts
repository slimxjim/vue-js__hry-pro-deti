export interface GameCalculation {
  gameType: EGameType;
  gameState: GameState;
  gameCreationTimestamp: string;
  level: CalculationLevel;
  gameScenario: Calculation[];
  player: Player; //owner
  opponent?: Player; //could be other person or PC or null (learning mode)
}

export interface GameState {
  gameProgress: EGameProgress;
  playerOnTurn: EPlayerTurn;
  timerEnabled: boolean;
  remainingTime: number;
  currentTurnIndexInGameScenario: number;
}

export enum EGameProgress {
  STARTED = 'STARTED',
  RUNNING = 'RUNNING',
  PAUSES = 'PAUSES',
  FINISHED = 'FINISHED',
  LEAVED_NOT_FINISHED = 'LEAVED_NOT_FINISHED'
}

export interface Player {
  user?: User;
  answers?: CalculationAnswer[];
}

export interface User {
  userID?: number;  // ID je volitelné, protože při vytváření nového hráče ještě neexistuje
  name?: string;
  username: string;
  passwordHash?: string; // Toto pole se běžně neposílá na frontend
  age?: number;
  classNumber?: number;
}

export enum EGameType {
  LEARNING = 'LEARNING',
  BATTLE_WITH_OTHER_PLAYER = 'BATTLE_WITH_OTHER_PLAYER',
  NUMBER_DECOMPOSITION = 'NUMBER_DECOMPOSITION',
}

export enum EPlayerTurn {
  PLAYER = 'PLAYER',
  OPPONENT = 'OPPONENT'
}

export interface CalculationAnswer {
  calculation: Calculation;
  calculationIndexInGameScenario: number;
  answer?: number;
  isCorrect: boolean;
  answerTimeFirstMs: number,
  answerTimeTotalMs: number,
  device: EDevice
}

export interface CalculationLevel {//TODO MinA -> aMin, aMax, bMin, bMax, resultMin, resultMax
  levelID?: number;
  Type: string;
  Name: string;
  MinA: number;
  MaxA: number;
  Operator: ECalculationOperator;
  MinB: number;
  MaxB: number;
  MinResult: number;
  MaxResult: number;
  Description: string;
}

export enum EDevice {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE'
}

export interface Calculation {
  operandA: number;
  operator: ECalculationOperator;
  operandB: number;
  correctAnswer: number;
}

export enum ECalculationOperator {
  PLUS = "+",
  MINUS = "-",
  PLUS_MINUS = "+-"
}

export interface GameHistory { //TODO předělat ale i model
  gameID: number
  creationTimestamp: string
  playerID: number
  currentTurn: string
  livesPlayer: number
  livesOpponent: number
  timeLimitSeconds: number
  currentLevelID: number
  lastExpression: string
  device: string

}
