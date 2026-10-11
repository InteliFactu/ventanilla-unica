import { asRecord } from '../../../dehu/api/asRecord'
import { readTextOrNull } from '../../../dehu/api/readTextOrNull'
import type { Outcome } from '../types/Outcome'

/**
 * Read `{ <envelope>: { codigoRespuesta: { codRespuesta, textoRespuesta }, mensaje } }`,
 * the shape of both email answers; `codRespuesta` 0 is success, and the
 * front shows `mensaje` (falling back to `textoRespuesta`) either way.
 */
export const readOutcome = (text: string, envelope: string): Outcome => {
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    throw new Error(`Carpeta: the ${envelope} answer was not JSON`)
  }
  const outer = asRecord(asRecord(body)?.[envelope])
  const code = asRecord(outer?.['codigoRespuesta'])
  const message =
    readTextOrNull(outer?.['mensaje']) ??
    readTextOrNull(code?.['textoRespuesta']) ??
    ''
  return { ok: code?.['codRespuesta'] === 0, message }
}
