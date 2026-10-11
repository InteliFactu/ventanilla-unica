import type { DgtContact } from '../types/DgtContact'
import { readText } from './readText'

/**
 * The contact data in a SAVI answer: `{ok: {email, tel}}`. Error 001 ("No se
 * encuentra ninguna información") means the DGT has none, which is an answer;
 * any other error is not.
 */
export const readSaviContact = (
  json: Record<string, unknown>,
): DgtContact | undefined => {
  if (json['ok'] !== undefined)
    return {
      email: readText(json['ok'], 'email'),
      telefono: readText(json['ok'], 'tel'),
    }
  if (readText(json['error'], 'errorCode') === '001') return undefined
  throw new Error(
    `DGT contact data: ${readText(json['error'], 'errorMsg') || 'unexpected answer'}`,
  )
}
