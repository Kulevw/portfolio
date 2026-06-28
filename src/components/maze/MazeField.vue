<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { DPR } from '@/constants'
import { makeRectField, type MazeField } from '@/utils/maze/field'

import { angleOfLine, lengthOfLine, type Line, type Point } from '@/utils/math'

import { useIsDarkTheme } from '@/utils/compostions/theme'
import { unionPolygones } from '@/utils/math/geometry/union-polygones'
import { unionLines } from '@/utils/math/geometry/union-lines'
import { RECT_GRAPH_TYPE, type RectGraph } from '@/utils/graph/rect-graph'
import type {
  MazeFieldProps,
  MazeFieldContext,
  MazeFieldParams,
} from '@/components/maze/MazeField.types'
import { getRandomItem } from '@/utils/array'
import { useRunningState } from '@/composition/use-running-state'

const props = defineProps<MazeFieldProps>()

const isDarkTheme = useIsDarkTheme()

const [isInitProcessing, withInitProcessing] = useRunningState()

const refRoot = ref<HTMLElement>()
const refCellsCanvas = ref<HTMLCanvasElement>()
const refSidesCanvas = ref<HTMLCanvasElement>()

const cache = {
  unionSides: null as Point[][] | null,
  unionCells: null as Point[][] | null,
}

const MazePalitra = {
  Cell: '#dadada',
  Side: '#202020',
  Transparent: 'trasparent',
}

onMounted(async () => {
  if (!refCellsCanvas.value || !refSidesCanvas.value || !refRoot.value) {
    return
  }

  ;[refCellsCanvas.value, refSidesCanvas.value].forEach(prepareCanvas)

  const params = props.initParams(refRoot.value.clientWidth, refRoot.value.clientHeight)

  const field = makeField(params)

  if (!field) {
    return
  }

  const ctx: MazeFieldContext = {
    field,
    params: props.initParams(refRoot.value.clientWidth, refRoot.value.clientHeight),
    cellsCtx: refCellsCanvas.value.getContext('2d') as CanvasRenderingContext2D,
    sidesCtx: refSidesCanvas.value.getContext('2d') as CanvasRenderingContext2D,
    rootElement: refRoot.value,
  }

  if (!field) {
    return
  }

  return await onInit(ctx)
})

function requestAnimationFrame(cb: () => void) {
  window.requestAnimationFrame(cb)
}

async function onInit(ctx: MazeFieldContext): Promise<() => void> {
  const stoppers: (() => void)[] = []

  ctx.field.nodeToCellPairsMap.forEach(([node]) => {
    getRandomItem(node.edges)?.setWeightToEdge(node, 1)
  })

  stoppers.push(
    watch(
      isDarkTheme,
      () => {
        updateMazePalitra(ctx.rootElement)
        refreshField(ctx)
      },
      { immediate: true },
    ),
  )

  await withInitProcessing(
    new Promise<void>((resolve) => {
      getUnionCellsCache(ctx, true)
      getUnionSidesCache(ctx, true)

      resolve()
    }),
  )

  return () => stoppers.forEach((stop) => stop())
}

function makeField({ graph, cellSize, lineWeight }: MazeFieldParams): MazeField | null {
  switch (graph.type) {
    case RECT_GRAPH_TYPE:
      return makeRectField(graph as RectGraph, lineWeight, cellSize, cellSize)
    default:
      console.warn('No match graph type')
      return null
  }
}

function drawPolygoneWithContext(ctx: CanvasRenderingContext2D): (points: Point[]) => void {
  return ([start, ...path]: Point[]) => {
    if (!start) {
      return
    }

    ctx.moveTo(...start)
    path.forEach((point) => ctx.lineTo(...point))
    ctx.closePath()
  }
}

function prepareCanvas(canvas: HTMLCanvasElement) {
  canvas.width = canvas.clientWidth * DPR
  canvas.height = canvas.clientHeight * DPR
}

function updateMazePalitra(root: HTMLElement) {
  const style = getComputedStyle(root)

  MazePalitra.Cell = style.getPropertyValue('--cell-color')
  MazePalitra.Side = style.getPropertyValue('--side-color')
}

function refreshField(ctx: MazeFieldContext) {
  redrawSides(ctx)
  redrawCells(ctx)
}

function getUnionCellsCache({ field }: MazeFieldContext, forceUpdate = false) {
  if (!cache.unionCells || forceUpdate) {
    const polygones = Array.from(field.nodeToCellPairsMap.values())
      // .filter(
      //   ([node]) =>
      //     ![
      //       39, 45, 81, 110, 190, 256, 305, 358, 415, 476, 541, 610, 602, 673, 748, 829, 914, 831,
      //       752, 675,
      //     ].includes(node.key),
      // )
      .map(([, cell]) => cell.vertices) as AtLeastOne<Point[]>

    cache.unionCells = unionPolygones(polygones)
  }

  return cache.unionCells
}

function getUnionSidesCache({ field, params }: MazeFieldContext, forceUpdate = false) {
  if (!cache.unionSides || forceUpdate) {
    const lines = [...field.sidesMap.values()].filter(([, from, to]) => !to?.isAvailableEdge(from))

    const groupedByAngle: Record<number, Line[]> = {}

    lines.forEach(([line]) => {
      const angle = angleOfLine(line.vertices)

      groupedByAngle[angle] = (groupedByAngle[angle] ?? []).concat([line.vertices])
    })

    console.log(groupedByAngle)

    const result = Object.values(groupedByAngle).flatMap((group) =>
      unionLines(group, params.lineWeight),
    )

    console.log(
      'lengths',
      result,
      result.map((line) => lengthOfLine(line as Line)).sort((a, b) => a - b),
    )

    cache.unionSides = result
  }

  return cache.unionSides
}

function redrawSides(ctx: MazeFieldContext) {
  // const hLines = lines
  //   .filter(([line]) => line.vertices[0][0] === line.vertices[1][0])
  //   .map(([line]) => line.vertices)
  // const vLines = lines
  //   .filter(([line]) => line.vertices[0][1] === line.vertices[1][1])
  //   .map(([line]) => line.vertices)

  // const hUnion = unionLines(hLines, ctx.params.lineWeight)
  // const vUnion = unionLines(vLines, ctx.params.lineWeight)
  // const result = hUnion.concat(vUnion)

  // console.log('h union', hUnion)
  // console.log('v union', vUnion)
  // console.log('v result', result)

  // const unionSides = getUnionSidesCache(ctx)

  // console.log('unionSides', unionSides)

  // console.log('double union', unionPolygones(result))

  const unionSides = getUnionSidesCache(ctx)

  requestAnimationFrame(() => {
    ctx.sidesCtx.beginPath()
    unionSides.forEach(drawPolygoneWithContext(ctx.sidesCtx))
    ctx.sidesCtx.fillStyle = MazePalitra.Side
    ctx.sidesCtx.fill()
  })
}

function redrawCells(ctx: MazeFieldContext) {
  const unionCells = getUnionCellsCache(ctx)

  requestAnimationFrame(() => {
    ctx.cellsCtx.beginPath()
    unionCells.forEach(drawPolygoneWithContext(ctx.cellsCtx))
    ctx.cellsCtx.fillStyle = MazePalitra.Cell
    ctx.cellsCtx.fill()
  })
}
</script>

<template>
  <div ref="refRoot" class="maze-field">
    <canvas ref="refCellsCanvas" class="maze-field__canvas" width="100%" height="100%" />
    <canvas ref="refSidesCanvas" class="maze-field__canvas" width="100%" height="100%" />
    <div v-if="isInitProcessing" class="maze-field__loader">Loading...</div>
  </div>
</template>

<style lang="scss" scoped>
.maze-field {
  --cell-color: var(--bg-color);
  --side-color: var(--text-color);

  position: relative;
  width: 800px;
  height: 600px;
  // background-color: var(--primary-color);

  &__canvas {
    position: absolute;
    display: block;
    inset: 0;
    width: 100%;
    height: 100%;
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
