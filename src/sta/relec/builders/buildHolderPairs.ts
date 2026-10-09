import type { FormPair } from '../../../http/types/FormPair'
import type { RelecForm } from '../types/RelecForm'

/**
 * The interested-party identification: the certificate holder, a natural
 * person (`tipoPersona=IF`), with the read-only values the sede filled in.
 */
export const buildHolderPairs = (form: RelecForm): readonly FormPair[] => [
  ['tipoPersona', 'IF'],
  ...['Acronym', 'docuNum', 'ctrlDigit', 'IJAcronym'].map((name): FormPair => [
    name,
    form.fields[name] ?? '',
  ]),
  ['IJTipoDoc', 'CIF'],
  ...[
    'CIF',
    'IJCIFCtrlDigit',
    'nombre',
    'apellido1',
    'apellido2',
    'IFApellido2Text',
    'razonSoc',
  ].map((name): FormPair => [name, form.fields[name] ?? '']),
]
