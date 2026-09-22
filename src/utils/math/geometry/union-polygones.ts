import type { Point } from '@/utils/math'
import { toIntPoint, toPoint } from '@/utils/math/geometry/helpers'
import { Clipper, PolyType, ClipType, PolyFillType, JS, type Paths } from 'clipper-lib'

import { SCALE } from './constants'

export const unionPolygones = (polygones: Point[][]): Point[][] => {
  if (!polygones.length) {
    return []
  }

  const paths = polygones.map((path) => path.map(toIntPoint))

  JS.ScaleUpPaths(paths, SCALE)

  const clipper = new Clipper()
  const solutionPaths: Paths = []

  const simplyPaths = Clipper.SimplifyPolygons(paths, PolyFillType.pftNonZero)

  clipper.AddPaths(simplyPaths, PolyType.ptSubject, true)

  clipper.Execute(ClipType.ctUnion, solutionPaths, PolyFillType.pftEvenOdd, PolyFillType.pftEvenOdd)

  JS.ScaleDownPaths(solutionPaths, SCALE)

  const result = solutionPaths.map((path) => path.map(toPoint))

  return result
}
