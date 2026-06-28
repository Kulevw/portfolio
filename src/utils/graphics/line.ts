import type { Drawable } from '@/utils/graphics/base'
import { type Line, type Point } from '@/utils/math'

export interface LineGraphics extends Drawable<Line> {
  draw(ctx: CanvasRenderingContext2D, color: string): void
}

export const makeLineGraphics = (p1: Point, p2: Point, weight: number): LineGraphics => {
  const vertices = [p1, p2] as Line

  const draw = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = weight * 2
    ctx.lineJoin = 'miter'
    ctx.lineCap = 'square'

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

// export const makeLineGraphics = (
//   [x1, y1]: Point,
//   [x2, y2]: Point,
//   weight: number,
// ): LineGraphics => {
//   const dx = x2 - x1
//   const dy = y2 - y1

//   const length = Math.sqrt(dx * dx + dy * dy)

//   // 3. Нормализованный вектор НАПРАВЛЕНИЯ (тангенс)
//   const tx = dx / length
//   const ty = dy / length

//   // 4. Нормализованный вектор ПЕРПЕНДИКУЛЯРА (нормаль)
//   const nx = -ty
//   const ny = tx

//   // 5. Вычисляем смещения (половина ширины)
//   const extX = tx * (weight / 2) // Смещение для удлинения
//   const extY = ty * (weight / 2)

//   const offsetX = nx * (weight / 2) // Смещение для толщины
//   const offsetY = ny * (weight / 2)

//   // 6. Сдвигаем базовые точки наружу
//   const ex1 = x1 - extX
//   const ey1 = y1 - extY
//   const ex2 = x2 + extX
//   const ey2 = y2 + extY

//   // 7. Добавляем толщину
//   const points: AtLeastOne<Point> = [
//     [ex1 + offsetX, ey1 + offsetY],
//     [ex1 - offsetX, ey1 - offsetY],
//     [ex2 - offsetX, ey2 - offsetY],
//     [ex2 + offsetX, ey2 + offsetY],
//   ]

//   const draw = (ctx: CanvasRenderingContext2D, color: string) => {
//     ctx.fillStyle = color

//     const [start, ...path] = points

//     ctx.beginPath()
//     ctx.moveTo(...start)
//     path.forEach((p) => ctx.lineTo(...p))
//     ctx.closePath()
//     ctx.fill()

//     // ctx.beginPath()
//     // ctx.fillStyle = 'cyan'
//     // ctx.ellipse(...start, 2, 2, 0, 0, 2 * Math.PI)
//     // ctx.fill()
//   }

//   const clear = (ctx: CanvasRenderingContext2D) => {
//     ctx.globalCompositeOperation = 'destination-out'
//     draw(ctx, 'black')
//     ctx.globalCompositeOperation = 'source-over'
//   }

//   return {
//     vertices: points,
//     draw,
//     clear,
//   }
// }
