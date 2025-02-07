import { type PuzzleImageModel, PuzzleRevealedState } from '@/types/puzzelTypes'
import { type Ref, ref } from 'vue'

export function usePuzzleImage() {

  const puzzleImageModel: Ref<PuzzleImageModel | undefined> = ref<PuzzleImageModel>();
  let currX: number = 0;
  let currY: number = 0;
    // {
    //   imageUrl: 'http://localhost:4001/images/bird.jpeg',
    //   revealedState: new PuzzleRevealedState(3, 3),
    //   countPieces: 9
    // };

  function setImage(imageUrl: string) {

  }

  function createPuzzle(imageUrl: string, imgWidthPx: number, imgHeightPx: number, countPieces: number) {
    // Vypočítání počtu sloupců a řádků
    const cols = Math.ceil(Math.sqrt(countPieces)); // Přibližně čtvercový tvar matice
    const rows = Math.ceil(countPieces / cols);     // Počet řádků

    // Velikost políček
    const squareWidthPx = imgWidthPx / cols;
    const squareHeightPx = imgHeightPx / rows;

    const covered = cols * rows;
    console.log(`Počet sloupců: ${cols}, Počet řádků: ${rows} pokryto: ${covered}/${countPieces}`);
    console.log(`Velikost políčka: ${squareWidthPx.toFixed(2)} x ${squareHeightPx.toFixed(2)} px`);

    puzzleImageModel.value = {
      imageUrl: imageUrl,
      countPieces: countPieces,
      revealedState: new PuzzleRevealedState(cols, rows)
    }

    currX = 0;
    currY = 0;

    console.log('Puzzle created: ',puzzleImageModel.value);
    puzzleImageModel.value.revealedState.printToConsole();
  }

  function setPieces(countPieces: number) {
    if (puzzleImageModel.value) {
      puzzleImageModel.value.countPieces = countPieces;
    }
  }

  function reset() {
    if (puzzleImageModel?.value?.revealedState) {
      puzzleImageModel.value.revealedState.hideAll();
      currX = 0;
      currY = 0;
    }
  }

  function setRevealedState(revealedState: PuzzleRevealedState) {

  }

  function revealNextRandom() {

  }

  function revealNext() {
    if (puzzleImageModel?.value?.revealedState) {
      const maxX = (puzzleImageModel.value.revealedState.maxX  ?? 0);
      const maxY = (puzzleImageModel.value.revealedState.maxY ?? 0);
      if (currX < maxX && currY < maxY) {
        puzzleImageModel?.value?.revealedState.reveal(currX, currY);
        if (currX < maxX - 1) {
          currX++;
        }
        else {
          currY++;
          currX = 0;
        }
        console.log('revealing next ' + currX + ' , ' + currY);
        if (puzzleImageModel.value.revealedState.revealedPiecesCount >= puzzleImageModel.value.countPieces) {
          puzzleImageModel.value.revealedState.revealAll();
          console.log('Reached count pieces, all revealed');
          currX = maxX;
          currY = maxY;
        }
      }
      else {
        console.log('fully revealed');
      }
    }
  }

  function hideNext() {
    if (puzzleImageModel?.value?.revealedState) {
      const maxX = (puzzleImageModel.value.revealedState.maxX  ?? 0);
      const maxY = (puzzleImageModel.value.revealedState.maxY ?? 0);
      console.log(currX,maxX,currY,maxY, (currX > 0 || currY > 0));
      if (currX > 0 || currY > 0) {
        if (currX > 0) {
          currX--;
        }
        else {
          currY--;
          currX = maxX - 1;
        }
        puzzleImageModel?.value?.revealedState.hide(currX, currY);
        console.log('hiding next ' + currX + ' , ' + currY);
      }
      else {
        console.log('fully hid');
      }
    }
  }


  function reveal(x: number, y: number) {
    if (puzzleImageModel.value) {
      puzzleImageModel.value.revealedState.reveal(x, y);
    }
  }

  function revealCount(count: number) {
    // if (puzzleImageModel.value) {
    //   const ret: {curX: number, curY:number } = puzzleImageModel.value.revealedState.revealCount(count);
    //   currX = ret.curX;
    //   currY = ret.curY;
    // }
    for (let y = 0; y < count; y++) {
      revealNext();
    }
  }

  return {
    puzzleImageModel,
    createPuzzle,
    reveal,
    revealCount,
    revealNext,
    hideNext,
    reset,
  }
}