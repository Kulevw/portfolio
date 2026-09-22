import type { Point } from '@/utils/math'

export const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`

export const syncCanvasTo = (
  fromCtx: CanvasRenderingContext2D,
  toCtx: CanvasRenderingContext2D,
) => {
  toCtx.save()
  toCtx.resetTransform()
  toCtx.drawImage(fromCtx.canvas, 0, 0, toCtx.canvas.width, toCtx.canvas.height)
  toCtx.restore()
}

export const eachPolygones = (ctx: CanvasRenderingContext2D, polygones: Point[][]) => {
  polygones.forEach(([start, ...path]: Point[]) => {
    if (!start) {
      return
    }

    ctx.moveTo(...start)
    path.forEach((point) => ctx.lineTo(...point))
  })
}

export const onFrame = (cb: () => void) => {
  window.requestAnimationFrame(cb)
}
