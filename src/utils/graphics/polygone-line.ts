import type { Graphics } from '@/utils/graphics/base'
import { eachPolygones } from '@/utils/graphics/helpers'
import { type Line, type Point } from '@/utils/math'
import { lineToPolygone } from '@/utils/math/geometry/line-to-polygone'

export interface PolygoneLineGraphics extends Graphics<Point[]> {
  draw(ctx: CanvasRenderingContext2D, color: string): void
  line: Line
}

export const makePolygoneLineGraphics = (
  p1: Point,
  p2: Point,
  weight: number,
): PolygoneLineGraphics => {
  const line = [p1, p2] as Line
  const vertices = lineToPolygone(line, weight)

  const draw = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    eachPolygones(ctx, [vertices])
    ctx.closePath()
    ctx.fill()
  }

  const clear = (ctx: CanvasRenderingContext2D) => {
    ctx.globalCompositeOperation = 'destination-out'

    draw(ctx, 'black')

    ctx.globalCompositeOperation = 'source-over'
  }

  return {
    vertices,
    line,
    draw,
    clear,
  }
}
