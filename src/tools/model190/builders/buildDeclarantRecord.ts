import { buildFixedWidthRecord } from '../../boeFixedWidth/builders/buildFixedWidthRecord'
import { model190DeclarantLayout } from '../layouts/model190DeclarantLayout'
import { declarationNumber } from '../mappers/declarationNumber'
import type { Model190Declarant } from '../types/Model190Declarant'
import type { Model190Perceptor } from '../types/Model190Perceptor'

/** The 500-character type 1 record: declarant, contact, first declaration, counts and totals. */
export const buildDeclarantRecord = (
  declarant: Model190Declarant,
  perceptors: readonly Model190Perceptor[],
): string => {
  const percepciones = perceptors.reduce((sum, row) => sum + row.percepcion, 0)
  const retenciones = perceptors.reduce((sum, row) => sum + row.retencion, 0)
  return buildFixedWidthRecord(model190DeclarantLayout, {
    ...declarant,
    nombre: declarant.nombre.slice(0, 40),
    contacto: declarant.contacto.slice(0, 40),
    declaracion: declarationNumber(declarant.ejercicio),
    registros: perceptors.length,
    percepciones,
    retenciones,
    correo: declarant.correo.toUpperCase(),
  })
}
