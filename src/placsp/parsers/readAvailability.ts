import type { PlacspStatusResult } from '../types/PlacspStatusResult'
import { readSpanText } from './readSpanText'

/**
 * Read the answer of "COMPROBAR DISPONIBILIDAD": `idMsjHiddenIdLibre` says
 * "Id usuario y email permitidos." when both are free; otherwise the message
 * next to each field (`message24` for the user id, "El usuario ya existe.";
 * `message248` for the e-mail) says what is taken.
 */
export const readAvailability = (
  html: string,
): Pick<PlacspStatusResult, 'account' | 'message'> => {
  const free = readSpanText(html, ':idMsjHiddenIdLibre')
  if (free !== undefined && /permitidos/i.test(free))
    return { account: 'none', message: free }
  const email = readSpanText(html, ':message248')
  if (email !== undefined && email !== '')
    return { account: 'exists', message: email }
  return { account: 'unknown', message: readSpanText(html, ':message24') }
}
