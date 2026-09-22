<script lang="ts" setup>
import { makeRectGraph } from '@/utils/graph/rect-graph.ts'

import MazeField from '@/components/maze/MazeField.vue'
import type { MazeFieldParams } from '@/components/maze/MazeField.types'

function initMazeFieldParams(width: number, height: number): MazeFieldParams {
  const lineWeight = 2

  // const cellSize = 20

  // const cols = Math.floor((width - lineWeight) / cellSize)

  const relativeCellSize = 80

  const cellSize = Math.floor((width - lineWeight) / relativeCellSize)

  const cols = Math.floor((width - lineWeight) / cellSize)

  const rows = Math.floor((height - lineWeight) / cellSize)

  const graph = makeRectGraph(rows, cols)

  console.log(`cellsSize: ${cellSize}`)
  console.log(`cols: ${cols}`)
  console.log(`rows: ${rows}`)

  return {
    graph,
    cellSize,
    lineWeight,
    actualWidth: cols * cellSize,
    actualHeight: rows * cellSize,
  }
}
</script>

<template>
  <div class="maze-generation">
    <MazeField :init-params="initMazeFieldParams" />
  </div>
</template>

<style lang="scss" scoped></style>
