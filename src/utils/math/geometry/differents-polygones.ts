import type { Point } from '@/utils/math'
import { toIntPoint, toPoint } from '@/utils/math/geometry/helpers'
import { Clipper, PolyType, ClipType, PolyFillType, JS, type Paths } from 'clipper-lib'

import { SCALE } from './constants'

export const differencePolygones = (target: Point[][], others: Point[][]): Point[][] => {
  const targetPaths = target.map((path) => path.map(toIntPoint))
  const othersPaths = others.map((path) => path.map(toIntPoint))

  JS.ScaleUpPaths(targetPaths, SCALE)
  JS.ScaleUpPaths(othersPaths, SCALE)

  const clipper = new Clipper()
  const solutionPaths: Paths = []

  clipper.AddPaths(targetPaths, PolyType.ptSubject, true)
  clipper.AddPaths(othersPaths, PolyType.ptSubject, true)

  clipper.Execute(
    ClipType.ctDifference,
    solutionPaths,
    PolyFillType.pftEvenOdd,
    PolyFillType.pftEvenOdd,
  )

  JS.ScaleDownPaths(solutionPaths, SCALE)

  const result = solutionPaths.map((path) => path.map(toPoint))

  return result
}
