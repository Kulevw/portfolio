import { RAD_TO_DEG, ZERO_EPSILONE } from '@/utils/math/constants'

export type Point = [number, number]

export type Line = [Point, Point]

export const addToPoint = ([x, y]: Point, addX: number, addY: number): Point => [x + addX, y + addY]

export const lengthOfLine = ([[x1, y1], [x2, y2]]: Line): number =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

export const centerOfLine = ([[x1, y1], [x2, y2]]: Line): Point => [(x1 + x2) / 2, (y1 + y2) / 2]

export const angleOfLine = ([[x1, y1], [x2, y2]]: Line): number => Math.atan2(x2 - x1, y2 - y1)

export const keyOfPoint = ([x, y]: Point) => `${x};${y}`

export const sin = (rad: number) => {
  const r = Math.sin(rad)

  return Math.abs(r) < ZERO_EPSILONE ? 0 : r
}

export const cos = (rad: number) => {
  const r = Math.cos(rad)

  return Math.abs(r) < ZERO_EPSILONE ? 0 : r
}

export const keyOfLine = (line: Line): string => {
  const center = centerOfLine(line).map((n) => Math.floor(n)) as Point

  return `${keyOfPoint(center)}`
  // return `${keyOfPoint(center)};${angleOfLine(line) * RAD_TO_DEG}`
}

export const sortLine = (ml: Line) => ml.sort((a, b) => a[0] - b[0] || a[1] - b[1])

export const zigZag = (n: number) => {
  return n > 0 ? n * 2 + 1 : n * 2
}

export const pairPoint = (...p: Point): number => {
  const [x, y] = p.map(zigZag) as Point

  return ((x + y) * (x + y + 1)) / 2 + y
}

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const safeIndex = (index: number, length: number): number => {
  if (!length) {
    return 0
  }

  return Math.abs((length + index) % length)
}
