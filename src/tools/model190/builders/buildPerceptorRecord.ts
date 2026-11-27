import { buildFixedWidthRecord } from '../../boeFixedWidth/builders/buildFixedWidthRecord'
import { model190PerceptorLayout } from '../layouts/model190PerceptorLayout'
import type { Model190Declarant } from '../types/Model190Declarant'
import type { Model190Perceptor } from '../types/Model190Perceptor'

/**
 * The 500-character type 2 record of the 2025 design (DISENOS_LOGICOS_190_2025):
 * dinerarias only, nothing in especie, no incapacidad laboral, no reductions,
 * descendants or foral data.
 */
export const buildPerceptorRecord = (
  declarant: Model190Declarant,
  perceptor: Model190Perceptor,
): string =>
  buildFixedWidthRecord(model190PerceptorLayout, {
    ...perceptor,
    ejercicio: declarant.ejercicio,
    nifDeclarante: declarant.nif,
    nombre: perceptor.nombre.slice(0, 40),
  })
