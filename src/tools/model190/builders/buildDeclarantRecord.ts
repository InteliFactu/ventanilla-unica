import { alphaField } from '../mappers/alphaField'
import { declarationNumber } from '../mappers/declarationNumber'
import { numberField } from '../mappers/numberField'
import type { Model190Declarant } from '../types/Model190Declarant'
import type { Model190Perceptor } from '../types/Model190Perceptor'

/** The 500-character type 1 record: declarant, contact, first declaration, counts and totals. */
export const buildDeclarantRecord = (
  declarant: Model190Declarant,
  perceptors: readonly Model190Perceptor[],
): string => {
  const percepciones = perceptors.reduce((sum, row) => sum + row.percepcion, 0)
  const retenciones = perceptors.reduce((sum, row) => sum + row.retencion, 0)
  return [
    `1190${declarant.ejercicio}${declarant.nif}`,
    alphaField(declarant.nombre.slice(0, 40), 40),
    'T',
    numberField(declarant.telefono, 9),
    alphaField(declarant.contacto.slice(0, 40), 40),
    declarationNumber(declarant.ejercicio),
    // 121: neither complementaria nor sustitutiva, no previous declaration
    `  ${'0'.repeat(13)}`,
    numberField(perceptors.length, 9),
    ` ${numberField(percepciones, 15)}`,
    numberField(retenciones, 15),
    alphaField(declarant.correo.toUpperCase(), 50),
  ]
    .join('')
    .padEnd(500, ' ')
}
