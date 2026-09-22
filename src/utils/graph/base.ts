import { uniqueId } from '@/utils/common'
import { makeEventEmitter, type EventEmitter } from '@/utils/event-emitter'

export enum GraphNodeState {
  Default = 'Default',
  Visited = 'Visited',
  Selected = 'Selected',
  Ready = 'Ready',
}

export interface GraphNode {
  key: string
  graph: Graph
  edges: GraphNode[]
  readonly state: GraphNodeState
  setState(state: GraphNodeState): void
  isAvailableEdge(edge: GraphNode): boolean
  setWeightToEdge(edge: GraphNode, weight: number): void
  getRelation(key: string): GraphNodeRealation | null
}

type GraphEvents = {
  'relation-updated'(from: GraphNode, to: GraphNode): void
  'node-state-updated'(node: GraphNode, newState: GraphNodeState, oldState: GraphNodeState): void
  'node-isolated'(node: GraphNode): void
  isolated(): void
}

export interface Graph extends EventEmitter<GraphEvents> {
  id: string
  type: string
  nodes: GraphNode[]
}

export interface GraphNodeRealation<P extends string = string> {
  position: P
  key: string
  weight: number
  setWeight(value: number): void
}

export interface GraphNodeExtended<
  G extends Graph = Graph,
  P extends string = string,
  R extends GraphNodeRealation<P> = GraphNodeRealation<P>,
  N extends GraphNode = GraphNode,
> extends GraphNode {
  graph: G
  edges: N[]
  relations: R[]
  getRelation(key: string): R | null
  getEdgeByPosition(position: P): N | null
  isAvailableEdge(edge: N): boolean
  setWeightToEdge(edge: N, weight: number): void
  isolate(): void
}

export interface GraphExtended<
  N extends GraphNode = GraphNode,
  T extends string = string,
> extends Graph {
  type: T
  nodes: N[]
  getNodeByKey(key: string): N | null
  isolate(): void
}

export const makeGraph = <N extends GraphNodeExtended, T extends string>(
  type: T,
  nodes: N[],
  nodesMap: Map<string, N>,
): GraphExtended<N, T> => {
  const getNodeByKey = (key: string) => nodesMap.get(key) ?? null

  const isolate = () => {
    nodes.forEach((node) => node.isolate())
    graph.emit('isolated')
  }

  const graph = {
    ...makeEventEmitter<GraphEvents>(),
    id: uniqueId('GRAPH'),
    type,
    nodes,
    getNodeByKey,
    isolate,
  }

  return graph
}

export const makeGraphNode = <
  N extends GraphNode,
  G extends GraphExtended<N>,
  P extends string = string,
  R extends GraphNodeRealation<P> = GraphNodeRealation<P>,
>(
  graph: G,
  key: string,
  edges: N[],
  edgesMap: Map<P, N>,
  relations: R[],
  relationsMap: Map<string, R>,
): GraphNodeExtended<G, P, R, N> => {
  let state = GraphNodeState.Default

  const getEdgeByPosition = (position: P) => edgesMap.get(position) ?? null

  const isAvailableEdge = (edge: N) => (relationsMap.get(edge.key)?.weight ?? 0) > 0

  const getRelation = (key: string) => relationsMap.get(key) ?? null

  const setState = (newState: GraphNodeState) => {
    const oldState = state

    state = newState

    graph.emit('node-state-updated', node, newState, oldState)
  }

  const setWeightToEdge = (edge: N, weight: number) => {
    getRelation(edge.key)?.setWeight(weight)
    edge.getRelation(key)?.setWeight(weight)

    graph.emit('relation-updated', node, edge)
  }

  const isolate = () => {
    relations.forEach((relation) => relation.setWeight(0))

    graph.emit('node-isolated', node)
  }

  const node = {
    graph,
    key,
    edges,
    relations,
    setState,
    getEdgeByPosition,
    isAvailableEdge,
    getRelation,
    setWeightToEdge,
    isolate,
    get state() {
      return state
    },
  }

  return node
}
