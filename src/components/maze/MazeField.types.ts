import type { Graph, GraphNodeState } from '@/utils/graph/base'
import type { Point } from '@/utils/math'
import type { MazeField } from '@/utils/maze/base'

export interface MazeFieldParams {
  graph: Graph
  actualWidth: number
  actualHeight: number
  cellSize: number
  lineWeight: number
}

export interface MazeFieldProps {
  initParams: (width: number, height: number) => MazeFieldParams
}

export interface MazeFieldContext {
  params: MazeFieldParams
  cellsCtx: CanvasRenderingContext2D
  sidesCtx: CanvasRenderingContext2D
  contactsCtx: CanvasRenderingContext2D
  rootElement: HTMLElement
  field: MazeField
}

export interface MazeFieldPalitra {
  Sides: { Default: string }
  Cells: Record<GraphNodeState, string>
}

export interface MazeFieldCache {
  unionSides: Point[][] | null
  unionCells: { isolated: Point[][] | null } & Record<GraphNodeState, Point[][] | null>
}
