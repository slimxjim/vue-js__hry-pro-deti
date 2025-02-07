import {
  type Calculation,
  type CalculationLevel,
  ECalculationOperator,
  EGameProgress,
  EGameType,
  EPlayerTurn, ESign,
  type GameCalculation,
  type GameState,
  type User
} from '@/types/calculationTypes'
import { TimestampUtils } from '@/utils/TimestampUtils'
import { logger } from '@/services/Logger'

export class GameCalculationLearnService {

  public static REMAINING_TIME_DEFAULT: number = 20;
  public static IS_SHUFFLED: boolean = false

  static createGame(level: CalculationLevel, user: User|undefined ): GameCalculation {
    const game: GameCalculation = {
      gameCreationTimestamp: TimestampUtils.getFormatedTimestamp(),
      gameScenario: this.generateScenario(level, GameCalculationLearnService.IS_SHUFFLED),
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
    logger.trace('generating scenario...', '', level);

    for (let a = level.MinA; a <= level.MaxA; a++) {
      for (let b = level.MinB; b <= level.MaxB; b++) {
        for (const operator of [ESign.PLUS, ESign.MINUS]) {
          // Generujeme obě varianty (a + b) a (b + a) pro obě operace
          let result: number = 0;
          if (operator === ESign.PLUS) {
            result = a + b;
          } else if (operator === ESign.MINUS) {
            result = a - b;
          }

          // Zkontrolujeme, zda výsledek spadá do daného rozsahu (pokud je definován)
          if (
            (level.MinResult !== undefined && result >= level.MinResult) &&
            (level.MaxResult !== undefined && result <= level.MaxResult)
          ) {
            const eq: Calculation = {
              operandA: a,
              operator: operator,
              operandB: b,
              correctAnswer: result
            };

            // Přidáme výpočet do scénáře
            scenario.push(eq);
          }
        }
      }
    }
    if (isShuffled) {
      this.shuffle(scenario);
    }
    logger.trace('Generated scenario:','',scenario);
    return scenario;
  }

  // static log(...args) {
  //   // Vytvoříme nový Error objekt pro získání stack trace
  //   const error = new Error();
  //   const stackLines = error.stack?.split("\n");
  //
  //   if (stackLines && stackLines.length > 2) {
  //     // Vezmeme volající řádek ze stack trace (index 2 je místo, odkud byla logovací funkce volána)
  //     const callerLine = stackLines[2].trim();
  //     console.log.apply(console, [...args, callerLine]); // Předáme všechny argumenty a přidáme info o volání
  //   } else {
  //     console.log.apply(console, args); // Fallback
  //   }
  // }

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

  static shuffle(array: any): [] {
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
    return array;
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