import { env } from '@/env'

export const DPR = env.IS_CLIENT ? window.devicePixelRatio || 1 : 1
// export const DPR = 1
