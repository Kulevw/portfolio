import { getRandomItem } from '@/utils/array'
import { GraphNodeState, type GraphNode } from '@/utils/graph'

export const mazeDepthFirstGeneration = async (
  from: GraphNode,
  delay?: () => Promise<void>,
): Promise<void> => {
  const notVisited = (n: GraphNode) => n.state === GraphNodeState.Default

  const updateState = async (...items: [GraphNode, GraphNodeState][]) => {
    items.forEach(([node, state]) => node.setState(state))
    await delay?.()
  }

  const removeEdge = async (from: GraphNode, to: GraphNode) => {
    from.setWeightToEdge(to, 1)
    // await delay?.()
  }

  let selected = from

  const visited: GraphNode[] = []

  while (selected) {
    const edges = selected.edges.filter(notVisited)

    if (!edges.length) {
      const next = visited.pop()

      if (!next) {
        await updateState([selected, GraphNodeState.Ready])
        break
      }

      await updateState([selected, GraphNodeState.Ready], [next, GraphNodeState.Selected])

      selected = next
      continue
    }

    visited.push(selected)

    // const next = selected.randomNeighbor(notVisited, frequency?.())

    // const next = getRandomItem(edges) as GraphNode

    const next = getRandomItem(selected.edges.filter(notVisited)) as GraphNode

    await removeEdge(selected, next)

    await updateState([selected, GraphNodeState.Visited], [next, GraphNodeState.Selected])

    selected = next
  }
}
