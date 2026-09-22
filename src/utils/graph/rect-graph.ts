import type { GraphExtended, GraphNodeExtended, GraphNodeRealation } from './base'
import { makeGraph, makeGraphNode } from './base'
import { keyOfPoint } from '../math'

export type RectGraphRelationPosition = 'top' | 'right' | 'bottom' | 'left'

export type RectGraphNodeRelation = GraphNodeRealation<RectGraphRelationPosition>

export interface RectGraphNode extends GraphNodeExtended<
  RectGraph,
  RectGraphRelationPosition,
  RectGraphNodeRelation,
  RectGraphNode
> {
  x: number
  y: number
}

export const RECT_GRAPH_TYPE = 'rect' as const

export interface RectGraph extends GraphExtended<RectGraphNode, typeof RECT_GRAPH_TYPE> {
  rows: number
  cols: number
}

const makeRectGraphNodeRelations = (
  x: number,
  y: number,
): [RectGraphNodeRelation[], Map<string, RectGraphNodeRelation>] => {
  const offsets: [number, number, RectGraphRelationPosition][] = [
    [0, -1, 'top'],
    [+1, 0, 'right'],
    [0, +1, 'bottom'],
    [-1, 0, 'left'],
  ]

  const keyToRelationPairs = offsets.map(([offsetX, offsetY, position]) => {
    const relationX = x + offsetX
    const relationY = y + offsetY

    const key = keyOfPoint(relationX, relationY)

    const setWeight = (value: number) => (relation.weight = value)

    const relation = {
      key,
      position,
      x: relationX,
      y: relationY,
      weight: 0,
      setWeight,
    }

    return [key, relation] as [string, RectGraphNodeRelation]
  })

  const relationsMap = new Map(keyToRelationPairs)

  return [[...relationsMap.values()], relationsMap]
}

const makeRectGraphNodeEdges = (): [
  RectGraphNode[],
  Map<RectGraphRelationPosition, RectGraphNode>,
] => {
  return [[], new Map()]
}

const makeRectGraphNode = (graph: RectGraph, x: number, y: number) => {
  const [relations, relationsMap] = makeRectGraphNodeRelations(x, y)
  const [edges, edgesMap] = makeRectGraphNodeEdges()

  const initEdges = () => {
    const positionToNodePairs = relations
      .map((r) => [r.position, graph.getNodeByKey(r.key)])
      .filter(([, node]) => !!node) as [RectGraphRelationPosition, RectGraphNode][]

    positionToNodePairs.forEach(([position, node]) => edgesMap.set(position, node))
    edges.push(...edgesMap.values())
  }

  const baseNode = makeGraphNode<RectGraphNode, RectGraph, RectGraphRelationPosition>(
    graph,
    keyOfPoint(x, y),
    edges,
    edgesMap,
    relations,
    relationsMap,
  )

  const node = {
    ...baseNode,
    x,
    y,
    get state() {
      return baseNode.state
    },
  }

  return [node, initEdges] as [RectGraphNode, () => void]
}

export const makeRectGraph = (rows: number, cols: number): RectGraph => {
  const nodes: RectGraphNode[] = []
  const nodesMap: Map<string, RectGraphNode> = new Map()

  const graph: RectGraph = {
    ...makeGraph('rect', nodes, nodesMap),
    rows,
    cols,
  }

  const initNodesEdges: (() => void)[] = []

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const [node, initEdges] = makeRectGraphNode(graph, x, y)

      initNodesEdges.push(initEdges)
      nodes.push(node)
      nodesMap.set(node.key, node)
    }
  }

  initNodesEdges.forEach((initEdges) => initEdges())

  return graph
}
