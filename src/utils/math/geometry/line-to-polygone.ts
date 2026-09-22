import type { Line, Point } from '@/utils/math'
import { toIntPoint, toPoint } from '@/utils/math/geometry'
import { ClipperOffset, EndType, JoinType, type Paths } from 'clipper-lib'

export const lineToPolygone = (line: Line, weight: number): Point[] => {
  const scaledLines = line.map(toIntPoint)

  const offsetter = new ClipperOffset()

  offsetter.AddPath(scaledLines, JoinType.jtSquare, EndType.etOpenSquare)

  const inflatedPolygons: Paths = []

  offsetter.Execute(inflatedPolygons, weight / 2)

  return inflatedPolygons.flatMap((path) => path.map(toPoint))
}
