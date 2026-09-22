import type { Point } from '@/utils/math'

export interface Graphics<V extends Point[] = Point[]> {
  readonly vertices: V
  draw(ctx: CanvasRenderingContext2D, color: string): void
  clear(ctx: CanvasRenderingContext2D): void
}
