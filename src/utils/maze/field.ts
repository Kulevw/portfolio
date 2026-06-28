import type { Graph, GraphNode } from '@/utils/graph/base'
import type { RectGraph, RectGraphNode } from '@/utils/graph/rect-graph'
import { keyOfLine, type Line } from '@/utils/math'
import {
  makeLineGraphics,
  makeRectGraphics,
  type Drawable,
  type LineGraphics,
  type RectGraphics,
} from '@/utils/graphics'

export type MazeFieldRawSide = [Line, GraphNode, GraphNode | null]

export type MazeFieldSide = [LineGraphics, GraphNode, GraphNode | null]

export type MazeFieldNodeToCellPair = [GraphNode, Drawable]

export interface MazeField {
  nodeToCellPairsMap: Map<number, MazeFieldNodeToCellPair>
  sidesMap: Map<string, MazeFieldSide>
}

export const makeField = <
  C extends Drawable = Drawable,
  N extends GraphNode = GraphNode,
  G extends Graph<N> = Graph<N>,
>(
  graph: G,
  sideWeight: number,
  makeCell: (node: N) => C,
  makeSides: (node: N, cell: C) => AtLeastOne<MazeFieldRawSide>,
): MazeField => {
  const nodeToCellPairMap = new Map(
    graph.nodes.map((node) => [node.key, [node, makeCell(node)] as [N, C]]),
  )

  const makeSidesMap = () => {
    const sidesMap = new Map<string, MazeFieldSide>()

    nodeToCellPairMap.forEach(([node, cell]) => {
      makeSides(node, cell).forEach(([line, from, to]) => {
        const key = keyOfLine(line)

        if (!sidesMap.has(key) && to) {
          sidesMap.set(key, [makeLineGraphics(...line, sideWeight), from, to])
        }
      })
    })

    // console.log(sidesMap)

    return sidesMap
  }

  const field: MazeField = {
    nodeToCellPairsMap: nodeToCellPairMap,
    sidesMap: makeSidesMap(),
  }

  return field
}

export type RectMazeField = MazeField

export const makeRectField = (
  graph: RectGraph,
  sideWeight: number,
  cellWidth: number,
  cellHeight: number = cellWidth,
): RectMazeField => {
  const makeCell = (node: RectGraphNode) =>
    makeRectGraphics(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight)

  const makeSides = (node: RectGraphNode, cell: RectGraphics): AtLeastOne<MazeFieldRawSide> => {
    const [luv, ruv, rdv, ldv] = cell.vertices

    const pointsToEdgePairs: AtLeastOne<MazeFieldRawSide> = [
      [[luv, ruv], node, node.getEdgeByPosition('top')],
      [[ruv, rdv], node, node.getEdgeByPosition('right')],
      [[rdv, ldv], node, node.getEdgeByPosition('bottom')],
      [[ldv, luv], node, node.getEdgeByPosition('left')],
    ]

    return pointsToEdgePairs
  }

  const field = makeField(graph, sideWeight, makeCell, makeSides)

  return field
}
