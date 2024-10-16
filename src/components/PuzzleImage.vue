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
import type { CSSProperties } from 'vue'; // Use type-only import

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
  } as CSSProperties;
});

// Calculate the puzzle container size
const puzzleStyle = computed(() => {
  return {
    position: 'relative',
    width: `${props.param_maxWidth}px`,
    height: `${props.param_maxHeight}px`,
  } as CSSProperties;
});

// Function to get the style for each piece, ensuring the whole image is covered
const getPieceStyle = (index: number): CSSProperties => {
  const aspectRatio = props.param_maxWidth / props.param_maxHeight;

  // Calculate number of columns and rows based on the aspect ratio and number of pieces
  const cols = Math.ceil(Math.sqrt(props.param_numberOfHiddenPieces * aspectRatio));
  const rows = Math.ceil(props.param_numberOfHiddenPieces / cols);

  // Calculate width and height of each piece
  const pieceWidth = props.param_maxWidth / cols;
  const pieceHeight = props.param_maxHeight / rows;

  const row = Math.floor(index / cols);
  const col = index % cols;

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
