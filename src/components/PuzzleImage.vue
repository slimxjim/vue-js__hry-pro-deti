<template>
  <div class="puzzle-container" :style="puzzleStyle">
    <img :src="param_imagesUrl" :style="imageStyle" />
    <div
      v-for="(piece, index) in pieces"
      :key="index"
      class="piece"
      :style="getPieceStyle(index)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Props
const props = defineProps<{
  param_numberOfHiddenPieces: number;
  param_imagesUrl: string;
  param_maxHeight: number;
  param_maxWidth: number;
}>();

// State to track the pieces
const pieces = ref<{ visible: boolean }[]>(
  Array.from({ length: props.param_numberOfHiddenPieces }, () => ({
    visible: false,
  }))
);

// Function to reveal a random piece
const next = () => {
  const hiddenPieces = pieces.value.filter(piece => !piece.visible);
  if (hiddenPieces.length > 0) {
    const randomIndex = Math.floor(Math.random() * hiddenPieces.length);
    hiddenPieces[randomIndex].visible = true;
  }
};

// Calculate the image size to maintain the aspect ratio
const imageStyle = computed(() => {
  return {
    maxWidth: `${props.param_maxWidth}px`,
    maxHeight: `${props.param_maxHeight}px`,
    objectFit: 'contain', // maintain aspect ratio
  };
});

// Calculate the puzzle container size
const puzzleStyle = computed(() => {
  return {
    position: 'relative',
    width: `${props.param_maxWidth}px`,
    height: `${props.param_maxHeight}px`,
  };
});

// Function to get the style for each piece, including its position
const getPieceStyle = (index: number) => {
  const piecesPerRow = Math.ceil(Math.sqrt(props.param_numberOfHiddenPieces));
  const pieceWidth = props.param_maxWidth / piecesPerRow;
  const pieceHeight = props.param_maxHeight / piecesPerRow;

  const row = Math.floor(index / piecesPerRow);
  const col = index % piecesPerRow;

  return {
    width: `${pieceWidth}px`,
    height: `${pieceHeight}px`,
    position: 'absolute',
    top: `${row * pieceHeight}px`,
    left: `${col * pieceWidth}px`,
    backgroundColor: 'white',
    opacity: pieces.value[index].visible ? 0 : 0.8, // 80% opacity for hidden pieces
    border: '1px solid red', // red border for each piece
    transition: 'opacity 0.3s',
  };
};

// Expose the next() function to be used externally
defineExpose({
  next,
});
</script>

<style scoped>
.puzzle-container {
  position: relative;
}
.piece {
  transition: opacity 0.3s;
}
</style>
