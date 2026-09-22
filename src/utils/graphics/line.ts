import type { Graphics } from '@/utils/graphics/base'
import { type Line, type Point } from '@/utils/math'

export interface LineGraphics extends Graphics<Line> {
  draw(ctx: CanvasRenderingContext2D, color: string): void
}

export const makeLineGraphics = (p1: Point, p2: Point, weight: number): LineGraphics => {
  const vertices = [p1, p2] as Line

  const draw = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = weight
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(...p1)
    ctx.lineTo(...p2)
    ctx.stroke()
  }

  const clear = (ctx: CanvasRenderingContext2D) => {
    ctx.globalCompositeOperation = 'destination-out'
    draw(ctx, 'black')
    ctx.globalCompositeOperation = 'source-over'
  }

  return {
    vertices,
    draw,
    clear,
  }
}
