import { logger } from '@/services/Logger'

export interface PuzzleImageModel {
  imageUrl: string,
  countPieces: number,
  revealedState: PuzzleRevealedState,
}

export class PuzzleRevealedState {
  revealedPiecesCount: number = 0;
  private revealedMapXY: Map<string, boolean> = new Map();
  public readonly maxX: number = 0;
  public readonly maxY: number = 0;

  constructor(private cols: number, private rows: number) {
    this.maxX = cols;
    this.maxY = rows;
  }

  revealCount(count: number):{curX: number, curY: number} {
    this.revealedPiecesCount = 0;
    for (let y = 0; y < this.maxY; y++) {
      for (let x = 0; x < this.maxX; x++) {
        // console.log(this.revealedPiecesCount);
        this.revealedMapXY.set(`${x},${y}`, true);
        // this.printToConsole();
        this.revealedPiecesCount++;
        if (this.revealedPiecesCount == count) {
          if (x + 1 >= this.maxX) {
          return {curX: 0, curY: y + 1} ;
          }
          return {curX: x + 1, curY: y} ;
        }
      }
    }
    return {curX: 0, curY: 0};
  }

  reveal(x: number, y: number) {
    if (x < this.maxX && y < this.maxY) {
      const key = `${x},${y}`;
      if (!this.revealedMapXY.has(key)) {
        this.revealedMapXY.set(key, true);
        this.revealedPiecesCount++;
      }
    }
  }

  hideAll() {
    for (let y = 0; y < this.maxY; y++) {
      for (let x = 0; x < this.maxX; x++) {
        const key = `${x},${y}`;
        this.revealedMapXY.set(key, false);
        this.revealedMapXY.delete(key);
        this.revealedPiecesCount = 0;
      }
    }
  }

  revealAll() {
    for (let y = 0; y < this.maxY; y++) {
      for (let x = 0; x < this.maxX; x++) {
        this.revealedMapXY.set(`${x},${y}`, true);
        this.revealedPiecesCount = this.maxX * this.maxY;
      }
    }
  }

  hide(x: number, y: number) {
    if (x < this.maxX && y < this.maxY) {
      const key = `${x},${y}`;
      if (this.revealedMapXY.has(key)) {
        this.revealedMapXY.delete(key);
        this.revealedPiecesCount = Math.max(0, this.revealedPiecesCount - 1);
      }
    }
  }

  isRevealed(x: number, y: number): boolean {
    return this.revealedMapXY.get(`${x},${y}`) ?? false;
  }

  printToConsole() {
    let output = '';
    for (let y = 0; y < this.maxY; y++) {
      let row = '';
      for (let x = 0; x < this.maxX; x++) {
        row += this.isRevealed(x, y) ? '1 ' : '0 ';
      }
      output += row.trim() + '\n';
    }
    logger.trace(output);
  }

  getMatrix(): boolean[][] {
    const array: boolean[][] = [];
    for (let y = 0; y < this.maxY; y++) {
      array[y] = [];
      for (let x = 0; x < this.maxX; x++) {
        array[y][x] = this.isRevealed(x, y);
      }
    }
    logger.trace('puzzle matrix: ', '', array);
    this.printToConsole();
    return array;
  }

}
