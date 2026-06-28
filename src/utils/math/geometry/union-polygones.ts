import type { Point } from '@/utils/math'
import { toIntPoint, toPoint } from '@/utils/math/geometry/helpers'
import { Clipper, PolyType, ClipType, PolyFillType, JS, type Paths } from 'clipper-lib'

const SCALE = 100

export const unionPolygones = (polygones: Point[][]): Point[][] => {
  const paths = polygones.map((path) => path.map(toIntPoint))

  if (!paths.length) {
    return []
  }

  JS.ScaleUpPaths(paths, SCALE)

  // console.log('paths', paths)

  const clipper = new Clipper()
  const solutionPaths: Paths = []

  const simplyPaths = Clipper.SimplifyPolygons(paths, PolyFillType.pftNonZero)

  // console.log('simplyPaths', simplyPaths)

  clipper.AddPaths(simplyPaths, PolyType.ptSubject, true)

  clipper.Execute(ClipType.ctUnion, solutionPaths, PolyFillType.pftEvenOdd, PolyFillType.pftEvenOdd)

  JS.ScaleDownPaths(solutionPaths, SCALE)

  const result = solutionPaths.map((path) => path.map(toPoint))

  return result
}
