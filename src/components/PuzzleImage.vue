<template>
  <div class="puzzle-container" :style="puzzleStyle">
    <img :src="param_imagesUrl" :style="imageStyle" ref="imageElement" />
    <div
      v-for="(piece, index) in pieces"
      :key="index"
      class="piece"
      :style="getPieceStyle(index)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CSSProperties } from 'vue';

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

// State to store the real dimensions of the image
const realImageWidth = ref(0);
const realImageHeight = ref(0);

// Function to reveal a random piece
const next = () => {
  const hiddenPieces = pieces.value.filter(piece => !piece.visible);
  if (hiddenPieces.length > 0) {
    const randomIndex = Math.floor(Math.random() * hiddenPieces.length);
    hiddenPieces[randomIndex].visible = true;
  }
};

// Calculate the real size of the image, maintaining the aspect ratio
const imageStyle = computed(() => {
  const maxWidth = props.param_maxWidth;
  const maxHeight = props.param_maxHeight;
  const aspectRatio = realImageWidth.value / realImageHeight.value;

  // Calculate dimensions while maintaining aspect ratio
  let width = maxWidth;
  let height = maxHeight;
  if (aspectRatio > 1) {
    height = maxWidth / aspectRatio;
  } else {
    width = maxHeight * aspectRatio;
  }

  return {
    width: `${width}px`,
    height: `${height}px`,
    objectFit: 'contain',
  } as CSSProperties;
});

// On mounted, calculate the real image dimensions from the actual image element
const imageElement = ref<HTMLImageElement | null>(null);
onMounted(() => {
  console.log('param_numberOfHiddenPieces = ', props.param_numberOfHiddenPieces);
  const img = imageElement.value;
  if (img) {
    img.onload = () => {
      realImageWidth.value = img.naturalWidth;
      realImageHeight.value = img.naturalHeight;
    };
  }
});

// Puzzle container style
const puzzleStyle = computed(() => {
  const maxWidth = props.param_maxWidth;
  const maxHeight = props.param_maxHeight;
  const aspectRatio = realImageWidth.value / realImageHeight.value;
  // Calculate dimensions while maintaining aspect ratio
  let width = maxWidth;
  let height = maxHeight;
  if (aspectRatio > 1) {
    height = maxWidth / aspectRatio;
  } else {
    width = maxHeight * aspectRatio;
  }

  return {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative',
  } as CSSProperties;
});

// Function to get the style for each piece, ensuring the whole image is covered
const getPieceStyle = (index: number): CSSProperties => {
  const cols = Math.ceil(Math.sqrt(props.param_numberOfHiddenPieces));
  const rows = Math.ceil(props.param_numberOfHiddenPieces / cols);
  // console.log('cols', cols);
  // console.log('rows', rows);

  // Get the actual dimensions of the resized image
  const aspectRatio = realImageWidth.value / realImageHeight.value;
  let actualWidth = props.param_maxWidth;
  let actualHeight = props.param_maxHeight;
  if (aspectRatio > 1) {
    actualHeight = props.param_maxWidth / aspectRatio;
  } else {
    actualWidth = props.param_maxHeight * aspectRatio;
  }

  // Calculate width and height for each piece to fit within the resized image
  const pieceWidth = actualWidth / cols;
  const pieceHeight = actualHeight / rows;

  const row = Math.floor(index / cols);
  const col = index % cols;

  return {
    width: `${pieceWidth}px`,
    height: `${pieceHeight}px`,
    position: 'absolute',
    top: `${row * pieceHeight}px`,
    left: `${col * pieceWidth}px`,
    backgroundColor: 'white',
    opacity: pieces.value[index].visible ? 0 : 1, // 80% opacity for hidden pieces
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
