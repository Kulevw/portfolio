<script lang="ts" setup>
import { makeRectGraph } from '@/utils/graph/rect-graph.ts'

import MazeField from '@/components/maze/MazeField.vue'
import { DPR } from '@/constants/index.ts'
import type { MazeFieldParams } from '@/components/maze/MazeField.types'

function initMazeFieldParams(width: number, height: number): MazeFieldParams {
  const lineWeight = 1 * DPR

  const cellSize = 10

  const cols = Math.floor((width * DPR) / cellSize)

  // const cols = 100

  // const cellSize = (width * DPR) / cols

  const rows = Math.floor((height * DPR) / cellSize)

  // console.log('cols', cols)
  // console.log('rows', rows)

  const graph = makeRectGraph(rows, cols)

  return {
    graph,
    cellSize,
    lineWeight,
  }
}
</script>

<template>
  <div class="maze-generation">
    <MazeField :init-params="initMazeFieldParams" />
  </div>
</template>

<style lang="scss" scoped></style>
