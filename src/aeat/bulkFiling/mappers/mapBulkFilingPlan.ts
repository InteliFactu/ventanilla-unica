import type { BulkFile } from '../types/BulkFile'
import type { BulkValidation } from '../types/BulkValidation'

/** What the AEAT validated and what --confirmar si would present. */
export const mapBulkFilingPlan = (
  file: BulkFile,
  validation: BulkValidation,
): string[] => [
  `Modelo ${file.modelo} ejercicio ${file.ejercicio}, declarante ${file.nif} ${file.nombre}`,
  `Envío ${validation.idEnvio}: ${String(validation.correctos)} records valid, ${String(validation.erroneos)} failing${validation.avisos ? ', with warnings' : ''}`,
  ...validation.errores,
  validation.erroneos === 0
    ? 'Confirmed, the return is signed with the firma básica and presented.'
    : 'Not presentable: fix the failing records first; a partial return is never presented.',
]
