import type { GcTime } from '@/types/GcTime'
import { ref } from 'vue'

export interface GameCalculation {
  gameId?: number
  gameType: EGameType;
  gameState: GameState;
  gameCreationTimestamp: string;
  level: CalculationLevel;
  gameScenario: Calculation[];
  player: Player; //owner
  opponent?: Player; //could be other person or PC or null (learning mode),
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
  PAUSED = 'PAUSED',
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
  answerTimeFirst: GcTime,
  answerTimeTotal: GcTime,
  device: EDevice
}

export interface CalculationLevel {//TODO MinA -> aMin, aMax, bMin, bMax, resultMin, resultMax
  LevelID?: number;
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
  operator: ESign;
  operandB: number;
  correctAnswer: number;
}

export enum ECalculationOperator {
  PLUS = "+",
  MINUS = "-",
  PLUS_MINUS = "+-"
}

export enum ESign {
  PLUS = "+",
  MINUS = "-",
}
export class ESignHelper {
  static valueOf(value: string): ESign | undefined {
    return Object.values(ESign).find(sign => sign === value);
  }

  static NameOf(value: string): keyof typeof ESign | undefined {
    return (Object.entries(ESign) as [keyof typeof ESign, string][])
      .find(([_, v]) => v === value)?.[0];
  }
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
///// DB ONLY Usage

export interface DoIncorrectAnswer {
  PlayerID?: number,
  OperandA: number,
  Operator: string,
  OperandB: number,
  CorrectAnswer: number,
  PlayerAnswer: number | null,
  AnswerTimeMs: number,
  LevelID: number,
  Device: string
}

export interface DoTurnHistory {
  TurnID?: number,
  PlayerID: number,
  LevelID: number,
  OperandA: number,
  Operator: string,
  OperandB: number,
  CorrectAnswer: number,
  PlayerAnswer: number | null,
  IsCorrect: boolean,
  AnswerTimeFirstMs: number,
  AnswerTimeTotalMs: number,
  Device: string
}

export interface DoGameHistory {
  GameID?: number,
  CreationTimestamp: string,
  PlayerID: number,
  CurrentTurn: string | null,
  LivesPlayer: number | null,
  LivesOpponent: number | null,
  TimeLimitSeconds: number | null,
  CurrentLevelID: number,
  LastExpression: string | null,
  Device: string
}

export interface AnswerData {
  ErrorID: number;
  PlayerID: number;
  OperandA: number;
  Operator: string;
  OperandB: number;
  CorrectAnswer: number;
  PlayerAnswer: number | null;
  AnswerTimeMs: number;
  LevelID: number;
  Device: string | null;
}

