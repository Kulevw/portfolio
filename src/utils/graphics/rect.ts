import type { Graphics } from '@/utils/graphics/base'
import { eachPolygones } from '@/utils/graphics/helpers'
import type { Line, Point } from '@/utils/math'

export type RectGraphics = Graphics<[...Line, ...Line]>

export const makeRectGraphics = (
  x: number,
  y: number,
  width: number,
  height: number,
): RectGraphics => {
  const points: [Point, Point, Point, Point] = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ]

  const draw = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    eachPolygones(ctx, [points])
    ctx.closePath()
    ctx.fill()
  }

  const clear = (ctx: CanvasRenderingContext2D) => {
    ctx.globalCompositeOperation = 'destination-out'
    draw(ctx, 'black')
    ctx.globalCompositeOperation = 'source-over'
  }

  return {
    vertices: points,
    draw,
    clear,
  }
}
