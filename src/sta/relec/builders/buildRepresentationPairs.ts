import type { FormPair } from '../../../http/types/FormPair'
import type { RelecRepresented } from '../types/RelecRepresented'

/**
 * "Actúa como representante" (`tipoActuacion=R`): no intermediate
 * representative (`RepIve*` empty), the represented entity selected and its
 * `Rep*` identification as `changeRepresentado()` fills it.
 */
export const buildRepresentationPairs = (
  represented: RelecRepresented,
): readonly FormPair[] => {
  const rep = (name: string, fallback = ''): FormPair => [
    name,
    represented.fields[name] ?? fallback,
  ]
  return [
    ['tipoActuacion', 'R'],
    ...['RepIveAcronym', 'RepIveDocuNum', 'RepIveDigito'].map(
      (name): FormPair => [name, ''],
    ),
    ['RepIveCIFTipoDoc', 'CIF'],
    ...[
      'RepIveCIF',
      'RepIveCIFCtrlDigit',
      'RepIveNombre',
      'RepIveApellido1',
      'RepIveApellido2',
      'RFIveApellido2Text',
      'RepIveRazonSoc',
    ].map((name): FormPair => [name, '']),
    ['representados', represented.dboid],
    ['tipoPersonaRepresented', represented.personType],
    rep('RepAcronym', 'ES'),
    ...[
      'RepDocuNum',
      'RepDigito',
      'RepCIF',
      'RepCIFCtrlDigit',
      'RepNombre',
      'RepApellido1',
      'RepApellido2',
    ].map((name) => rep(name)),
    ['RFApellido2Text', ''],
    rep('RepRazonSoc'),
  ]
}
