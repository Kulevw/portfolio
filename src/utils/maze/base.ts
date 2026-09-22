import type {
  GraphExtended,
  GraphNode,
  GraphNodeExtended,
  GraphNodeState,
} from '@/utils/graph/base'
import { keyOfPoint, type Line, type Point } from '@/utils/math'
import {
  makePolygoneLineGraphics,
  makeRectGraphics,
  type Graphics,
  type PolygoneLineGraphics,
  type RectGraphics,
} from '@/utils/graphics'
import { makeEventEmitter, type EventEmitter } from '@/utils/event-emitter'

export type MazeFieldRawSide<N extends GraphNodeExtended = GraphNodeExtended> = [
  string,
  ...MazeFieldSide<N>,
]

export type MazeFieldSide<N extends GraphNodeExtended = GraphNodeExtended> = [
  PolygoneLineGraphics,
  N,
  N | null,
]

export interface MazeFieldCell<N extends GraphNodeExtended = GraphNodeExtended> {
  key: string
  graphics: Graphics
  node: N
}

type MazeEvents = {
  'relation-updated'(from: MazeFieldCell, to: MazeFieldCell): void
  'cell-state-updated'(
    cell: MazeFieldCell,
    newState: GraphNodeState,
    oldState: GraphNodeState,
  ): void
  'cell-isolated'(cell: MazeFieldCell): void
  isolated(): void
}

export interface MazeField extends EventEmitter<MazeEvents> {
  sides: MazeFieldSide[]
  cells: MazeFieldCell[]
  contacts: Graphics[]
  getCell(key: string): MazeFieldCell | null
  getSide(from: MazeFieldCell, to: MazeFieldCell | null): Graphics | null
}

export const makeFieldCell = <N extends GraphNodeExtended = GraphNodeExtended>(
  node: N,
  graphics: Graphics,
): MazeFieldCell<N> => {
  return {
    node,
    graphics,
    get key() {
      return node.key
    },
  }
}

export const makeField = <
  N extends GraphNodeExtended = GraphNodeExtended,
  G extends GraphExtended<N> = GraphExtended<N>,
  C extends MazeFieldCell<N> = MazeFieldCell<N>,
>(
  graph: G,
  sideWeight: number,
  makeCell: (node: N) => C,
  makeSides: (cell: C) => [Line, string, N | null][],
): MazeField => {
  const em = makeEventEmitter<MazeEvents>()

  const cells = graph.nodes.map((node) => makeCell(node))

  const cellsMap = new Map(cells.map((cell) => [cell.key, cell]))

  const keyOfPairNodes = (from: string, to?: string) => [from, to].sort().join('|')

  const calculateSides = (): [MazeFieldSide<N>[], Map<string, MazeFieldSide<N>>] => {
    const sidesMap = new Map<string, MazeFieldSide<N>>()

    cells.forEach((cell) => {
      makeSides(cell).forEach(([line, pos, edge]) => {
        const key = keyOfPairNodes(cell.node.key, edge?.key ?? pos)

        if (!sidesMap.has(key)) {
          sidesMap.set(key, [makePolygoneLineGraphics(...line, sideWeight), cell.node, edge])
        }
      })
    })

    const sides = Array.from(sidesMap.values())

    return [sides, sidesMap]
  }

  const calculateContacts = (): [Graphics[], Map<string, Graphics>] => {
    const contactsMap = new Map<string, Graphics>()

    sides.forEach(([side]) => {
      side.line.forEach((p) => {
        const key = keyOfPoint(...p)

        if (!contactsMap.has(key)) {
          contactsMap.set(key, makePolygoneLineGraphics(p, p, sideWeight))
        }
      })
    })

    const contacts = Array.from(contactsMap.values())

    return [contacts, contactsMap]
  }

  const [sides, sidesMap] = calculateSides()

  const [contacts] = calculateContacts()

  const getCell = (key: string) => cellsMap.get(key) ?? null

  const getSide = (from: N, to: N | null) =>
    sidesMap.get(keyOfPairNodes(from.key, to?.key))?.[0] ?? null

  const field: MazeField = {
    ...em,
    sides,
    cells,
    contacts,
    getCell,
    getSide,
  }

  graph.on('isolated', () => em.emit('isolated'))
  graph.on('node-isolated', (node) => em.emit('cell-isolated', getCell(node.key) as C))
  graph.on('node-state-updated', (node, ...others) =>
    em.emit('cell-state-updated', getCell(node.key) as C, ...others),
  )
  graph.on('relation-updated', (from, to) =>
    em.emit('relation-updated', getCell(from.key) as C, getCell(to.key) as C),
  )

  return field
}
