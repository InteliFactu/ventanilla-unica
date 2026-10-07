import { isLegalEntityNif } from '../../taxAddress/validators/isLegalEntityNif'
import type { DeregistrationRequest } from '../types/DeregistrationRequest'
import { successorProblems } from './successorProblems'

/** Every reason the baja options cannot be filed as given; empty means valid. */
export const deregistrationProblems = (
  request: DeregistrationRequest,
): readonly string[] => {
  const checks: readonly (readonly [boolean, string])[] = [
    [
      isLegalEntityNif(request.nif),
      `--nif ${request.nif} is not a legal entity or ESPJ: only the persona jurídica 036 has been captured.`,
    ],
    [
      /^\d{2}\/\d{2}\/\d{4}$/.test(request.fecha),
      '--fecha must be DD/MM/YYYY (fecha efectiva de la baja, casilla 152).',
    ],
    [
      request.causa !== 'disolucion' || request.sucesores.length > 0,
      '--causa disolucion needs --sucesores (page 13): the AEAT asks who succeeds the entity.',
    ],
    [request.sucesores.length <= 12, 'The 036 takes at most 12 sucesores.'],
    [request.lugar.trim() !== '', '--lugar is required.'],
    [request.firmado.trim() !== '', '--firmado is required.'],
    [request.calidad.trim() !== '', '--calidad is required.'],
  ]
  return [
    ...checks.filter(([ok]) => !ok).map(([, message]) => message),
    ...request.sucesores.flatMap(successorProblems),
  ]
}
