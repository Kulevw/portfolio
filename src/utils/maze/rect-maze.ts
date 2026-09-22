import type { RectGraph, RectGraphNode, RectGraphRelationPosition } from '@/utils/graph'
import { makePolygoneLineGraphics, makeRectGraphics, type RectGraphics } from '@/utils/graphics'
import { type Line } from '@/utils/math'
import {
  makeField,
  type MazeField,
  type MazeFieldRawSide,
  type MazeFieldCell,
  makeFieldCell,
} from '@/utils/maze/base'

export type RectMazeField = MazeField
export type RectMazeFieldCell = MazeFieldCell<RectGraphNode>

export const makeRectFieldCell = (
  node: RectGraphNode,
  graphics: RectGraphics,
): RectMazeFieldCell => {
  return {
    ...makeFieldCell(node, graphics),
  }
}

export const makeRectField = (
  graph: RectGraph,
  sideWeight: number,
  cellWidth: number,
  cellHeight: number = cellWidth,
): RectMazeField => {
  const makeCell = (node: RectGraphNode) =>
    makeRectFieldCell(
      node,
      makeRectGraphics(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight),
    )

  const makeSides = ({
    node,
    graphics,
  }: RectMazeFieldCell): [Line, RectGraphRelationPosition, RectGraphNode][] => {
    const [luv, ruv, rdv, ldv] = graphics.vertices

    const lineToPositionEdge = [
      [[luv, ruv], 'top', node.getEdgeByPosition('top')],
      [[ruv, rdv], 'right', node.getEdgeByPosition('right')],
      [[rdv, ldv], 'bottom', node.getEdgeByPosition('bottom')],
      [[ldv, luv], 'left', node.getEdgeByPosition('left')],
    ] as [Line, RectGraphRelationPosition, RectGraphNode][]
    // .filter(([, edge]) => !!edge)

    return lineToPositionEdge
  }

  const field = makeField(graph, sideWeight, makeCell, makeSides)

  return field
}
