import type { Point } from '@/utils/math'
import type { IntPoint } from 'clipper-lib'

export const toIntPoint = ([X, Y]: Point): IntPoint => ({ X, Y })

export const toPoint = ({ X, Y }: IntPoint): Point => [X, Y]
