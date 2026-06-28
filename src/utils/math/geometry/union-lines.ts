import type { Line, Point } from '@/utils/math'
import { toIntPoint, toPoint } from '@/utils/math/geometry/helpers'
import { unionPolygones } from '@/utils/math/geometry/union-polygones'
import { type Paths, ClipperOffset, JoinType, EndType } from 'clipper-lib'

export const unionLines = (lines: Line[], weight: number): Point[][] => {
  if (lines.length === 0) return []

  // console.log('initial lines', lines)

  const scaledLines = lines.map((line) => line.map(toIntPoint))

  const offsetter = new ClipperOffset()

  offsetter.AddPaths(scaledLines, JoinType.jtSquare, EndType.etOpenSquare)

  const inflatedPolygons: Paths = []

  offsetter.Execute(inflatedPolygons, weight)

  return unionPolygones(inflatedPolygons.map((path) => path.map(toPoint)))
}
