import type { RayuelaTemplate } from '../types/RayuelaTemplate'

import { decodeRayuelaAnswer } from './decodeRayuelaAnswer'

/** Template answers are JSON in UTF-8 or Latin-1 depending on the template, and `estadoCorrecto` says whether the portal accepted the call. */
export const parseRayuelaTemplate = (body: Buffer): RayuelaTemplate => {
  const data: unknown = JSON.parse(decodeRayuelaAnswer(body).trim())
  if (
    typeof data !== 'object' ||
    data === null ||
    !('estadoCorrecto' in data) ||
    !('config' in data) ||
    typeof data.config !== 'object' ||
    data.config === null
  )
    throw new Error('Rayuela returned an invalid template answer')
  const status =
    'mensajeEstado' in data && typeof data.mensajeEstado === 'string'
      ? data.mensajeEstado
      : ''
  if (data.estadoCorrecto !== true)
    throw new Error(`Rayuela refused the request: ${status}`)
  return { config: Object.fromEntries(Object.entries(data.config)), status }
}
