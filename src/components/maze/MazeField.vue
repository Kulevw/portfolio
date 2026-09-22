<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { type MazeField } from '@/utils/maze/base'

import { angleOfLine } from '@/utils/math'

import { useIsDarkTheme } from '@/composition/use-theme'
import { unionPolygones } from '@/utils/math/geometry/union-polygones'
import { RECT_GRAPH_TYPE, type RectGraph } from '@/utils/graph/rect-graph'
import type {
  MazeFieldProps,
  MazeFieldContext,
  MazeFieldParams,
  MazeFieldPalitra,
  MazeFieldCache,
} from '@/components/maze/MazeField.types'
import { getRandomItem, groupBy } from '@/utils/array'
import { useRunningState } from '@/composition/use-running-state'
import { eachPolygones, onFrame, syncCanvasTo } from '@/utils/graphics'
import { makeRectField } from '@/utils/maze/rect-maze'
import { mazeDepthFirstGeneration } from '@/utils/maze/generation/depth-first'
import { wait } from '@/utils/async'
import { GraphNodeState } from '@/utils/graph'
import { differencePolygones } from '@/utils/math/geometry/differents-polygones'

const props = defineProps<MazeFieldProps>()

const isDarkTheme = useIsDarkTheme()

const [isInitProcessing, withInitProcessing] = useRunningState()

const SCALE = 1

const refRootContainer = ref<HTMLElement>()
const refCellsCanvas = ref<HTMLCanvasElement>()
const refSidesCanvas = ref<HTMLCanvasElement>()
const refContactsCanvas = ref<HTMLCanvasElement>()

const cache: MazeFieldCache = {
  unionSides: null,
  unionCells: {
    [GraphNodeState.Default]: null,
    [GraphNodeState.Ready]: null,
    [GraphNodeState.Selected]: null,
    [GraphNodeState.Visited]: null,
    isolated: null,
  },
}

const MazePalitra: MazeFieldPalitra = {
  Sides: {
    Default: 'black',
  },
  Cells: {
    Default: 'white',
    Selected: 'cyan',
    Visited: 'yellow',
    Ready: 'white',
  },
}

let onThemeChangeHandler: (() => void) | null = null

watch(isDarkTheme, () => {
  onThemeChangeHandler?.()
})

onMounted(init)

function makeField({ graph, cellSize, lineWeight }: MazeFieldParams): MazeField | null {
  switch (graph.type) {
    case RECT_GRAPH_TYPE:
      return makeRectField(graph as RectGraph, lineWeight, cellSize, cellSize)
    default:
      return null
  }
}

function makeContext(): MazeFieldContext | null {
  if (
    !refRootContainer.value ||
    !refCellsCanvas.value ||
    !refSidesCanvas.value ||
    !refContactsCanvas.value
  ) {
    return null
  }

  const params = props.initParams(
    refRootContainer.value.clientWidth,
    refRootContainer.value.clientHeight,
  )

  const field = makeField(params)

  if (!field) {
    return null
  }

  return {
    field,
    params,
    rootElement: refRootContainer.value,
    cellsCtx: getPreparedCanvasCtx(refCellsCanvas.value, refRootContainer.value, params, SCALE),
    sidesCtx: getPreparedCanvasCtx(refSidesCanvas.value, refRootContainer.value, params, SCALE),
    contactsCtx: getPreparedCanvasCtx(
      refContactsCanvas.value,
      refRootContainer.value,
      params,
      SCALE,
    ),
  }
}

async function init(): Promise<void> {
  const ctx = makeContext()

  if (!ctx) {
    return
  }

  const [virtualCellsCtx, virtualSidesCtx, virtualContactsCts] = [
    getPreparedCanvasCtx(document.createElement('canvas'), ctx.rootElement, ctx.params, SCALE),
    getPreparedCanvasCtx(document.createElement('canvas'), ctx.rootElement, ctx.params, SCALE),
    getPreparedCanvasCtx(document.createElement('canvas'), ctx.rootElement, ctx.params, SCALE),
  ] as [CanvasRenderingContext2D, CanvasRenderingContext2D, CanvasRenderingContext2D]

  ctx.field.on('cell-state-updated', (cell, newState, oldState) => {
    const vertices = cell.graphics.vertices

    cache.unionCells[oldState] = differencePolygones(cache.unionCells[oldState] ?? [vertices], [
      vertices,
    ])
    cache.unionCells[newState] = unionPolygones(
      (cache.unionCells[newState] ?? []).concat([vertices]),
    )

    onFrame(() => {
      cell.graphics.draw(ctx.cellsCtx, MazePalitra.Cells[newState])
    })
  })

  ctx.field.on('relation-updated', (from, to) => {
    const side = ctx.field.getSide(from, to)

    const isAvailable = to.node.isAvailableEdge(from.node)

    const draw = isAvailable
      ? () => side?.clear(ctx.sidesCtx)
      : () => side?.draw(ctx.sidesCtx, MazePalitra.Sides.Default)

    cache.unionSides = isAvailable
      ? differencePolygones(cache.unionSides ?? [], [side?.vertices ?? []])
      : unionPolygones((cache.unionSides ?? []).concat([side?.vertices ?? []]))

    onFrame(draw)
  })

  onThemeChangeHandler = () => {
    updateMazePalitra(ctx.rootElement)

    onFrame(() => {
      drawField(ctx)
    })
  }

  onThemeChangeHandler()

  await withInitProcessing(
    new Promise<void>((resolve) => {
      drawField(ctx, [virtualCellsCtx, virtualSidesCtx, virtualContactsCts])

      onFrame(() => {
        syncCanvasTo(virtualCellsCtx, ctx.cellsCtx)
        syncCanvasTo(virtualSidesCtx, ctx.sidesCtx)
        syncCanvasTo(virtualContactsCts, ctx.contactsCtx)
        resolve()
      })
    }),
  )

  const start = getRandomItem(ctx.params.graph.nodes)

  if (start) {
    mazeDepthFirstGeneration(start, () => wait(0))
  }
}

function drawCells(mazeCtx: MazeFieldContext, virtualCtx?: CanvasRenderingContext2D) {
  const cellsCtx = virtualCtx ?? mazeCtx.cellsCtx

  Object.values(GraphNodeState).forEach((state) => {
    cellsCtx.beginPath()
    eachPolygones(cellsCtx, getCellsCache(state, mazeCtx))
    cellsCtx.closePath()
    cellsCtx.fillStyle = MazePalitra.Cells[state]
    cellsCtx.fill('evenodd')
  })
}

function drawSides(mazeCtx: MazeFieldContext, virtualCtx?: CanvasRenderingContext2D) {
  const sidesCtx = virtualCtx ?? mazeCtx.sidesCtx

  sidesCtx.beginPath()
  eachPolygones(sidesCtx, getSidesCache(mazeCtx))
  sidesCtx.closePath()
  sidesCtx.fillStyle = MazePalitra.Sides.Default
  sidesCtx.fill()
}

function drawContacts(mazeCtx: MazeFieldContext, virtualCtx?: CanvasRenderingContext2D) {
  const contactsCtx = virtualCtx ?? mazeCtx.contactsCtx

  mazeCtx.field.contacts.forEach((g) => g.draw(contactsCtx, MazePalitra.Sides.Default))
}

function drawField(
  mazeCtx: MazeFieldContext,
  [virtualCellsCtx, virtualSidesCtx, virtualContactsCtx]: CanvasRenderingContext2D[] = [],
) {
  drawCells(mazeCtx, virtualCellsCtx)
  drawSides(mazeCtx, virtualSidesCtx)
  drawContacts(mazeCtx, virtualContactsCtx)
}

function getPreparedCanvasCtx(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  params: MazeFieldParams,
  scale = 1,
): CanvasRenderingContext2D {
  const { width, height } = container.getBoundingClientRect()

  canvas.width = width * scale
  canvas.height = height * scale

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  ctx.imageSmoothingEnabled = false
  ctx.imageSmoothingQuality = 'high'

  // ctx.scale(scale, scale)
  ctx.translate(
    Math.round((width - params.actualWidth) / 2),
    Math.round((height - params.actualHeight) / 2),
  )

  return ctx
}

function updateMazePalitra(rootContainer: HTMLElement) {
  const style = getComputedStyle(rootContainer)

  MazePalitra.Sides.Default = style.getPropertyValue('--side-color')

  MazePalitra.Cells.Default = style.getPropertyValue('--cell-default-color')
  MazePalitra.Cells.Ready = style.getPropertyValue('--cell-ready-color')
  MazePalitra.Cells.Selected = style.getPropertyValue('--cell-selected-color')
  MazePalitra.Cells.Visited = style.getPropertyValue('--cell-visited-color')
}

function getCellsCache(state: GraphNodeState, { field }: MazeFieldContext) {
  if (!cache.unionCells[state]) {
    const polygones = field.cells
      .filter((cell) => cell.node.state === state)
      .map((cell) => cell.graphics.vertices)

    cache.unionCells[state] = unionPolygones(polygones)
  }

  return cache.unionCells[state]
}

function getSidesCache({ field }: MazeFieldContext) {
  if (!cache.unionSides) {
    const graphicsSides = field.sides
      .filter(([, from, to]) => !to?.isAvailableEdge(from))
      .map(([g]) => g)

    const groupedByAngle = groupBy(graphicsSides, (g) => angleOfLine(g.line))

    const result = Object.values(groupedByAngle).flatMap((group) =>
      unionPolygones(group.map((g) => g.vertices)),
    )

    cache.unionSides = result
  }

  return cache.unionSides
}
</script>

<template>
  <div ref="refRootContainer" class="maze-field">
    <canvas ref="refCellsCanvas" class="maze-field__canvas" width="100%" height="100%" />
    <canvas ref="refSidesCanvas" class="maze-field__canvas" width="100%" height="100%" />
    <canvas ref="refContactsCanvas" class="maze-field__canvas" width="100%" height="100%" />
    <div v-if="isInitProcessing" class="maze-field__loader">Loading...</div>
  </div>
</template>

<style lang="scss" scoped>
.maze-field {
  --cell-default-color: var(--bg-color);
  --cell-ready-color: var(--bg-color);
  --cell-selected-color: var(--selected-color);
  --cell-visited-color: var(--visited-color);
  --side-color: var(--text-color);

  position: relative;
  padding-top: calc(9 / 16 * 100%);

  &__canvas {
    position: absolute;
    display: block;
    inset: 0;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }

  &__loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-lg);
    z-index: 1;
  }
}
</style>
