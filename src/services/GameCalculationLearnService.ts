import {
  type Calculation,
  type CalculationLevel,
  ECalculationOperator,
  EGameProgress,
  EGameType,
  EPlayerTurn,
  type GameCalculation,
  type GameState,
  type User
} from '@/types/calculationTypes'
import { TimestampUtils } from '@/utils/TimestampUtils'

export class GameCalculationLearnService {

  public static REMAINING_TIME_DEFAULT: number = 20;
  public static IS_SHUFFELED: boolean = false

  static createGame(level: CalculationLevel, user: User|undefined ): GameCalculation {
    const game: GameCalculation = {
      gameCreationTimestamp: TimestampUtils.getFormatedTimestamp(),
      gameScenario: this.generateScenario(level, GameCalculationLearnService.IS_SHUFFELED),
      gameState: this.initGameState(),
      gameType: EGameType.LEARNING,
      level: level,
      opponent: undefined,
      player: { user: user, answers: []}
    }
    return game;
  }

  static generateScenario(level: CalculationLevel, isShuffled?: boolean): Calculation[] {
    const scenario: Calculation[] = [];
    console.log('generating scenario...', level);
    for (let a = level.MinA; a <= level.MaxA; a++) {
      for (let b = level.MinB; b <= level.MaxB && a + b <= level.MaxResult && a + b >= level.MinResult; b++) {
        const sign = this.getSign(level.Operator);
        const isAddition = sign === '+';
        const eq: Calculation = {
          operandA: a,
          operator: isAddition ? ECalculationOperator.PLUS : ECalculationOperator.MINUS,
          operandB: b,
          correctAnswer: isAddition ? a + b : a - b
        }
        // console.log('Pushing calculation: ', eq);
        scenario.push(eq);
      }
    }

    if (isShuffled) {
      this.shuffle(scenario);
    }

    return scenario;
  }

  static getSign(sign: ECalculationOperator): string {
    switch (sign) {
      case ECalculationOperator.PLUS:
        return '+';
      case ECalculationOperator.MINUS:
        return '-';
      case ECalculationOperator.PLUS_MINUS:
        return Math.random() > 0.5 ? '+' : '-';
    }
  }

  static shuffle(array: any) {
    // https://stackoverflow.com/a/2450976/8494889
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  static initGameState(): GameState {
    const state: GameState = {
      currentTurnIndexInGameScenario: 0,
      gameProgress: EGameProgress.STARTED,
      playerOnTurn: EPlayerTurn.PLAYER,
      remainingTime: GameCalculationLearnService.REMAINING_TIME_DEFAULT,
      timerEnabled: false
    }
    return state;
  }

}