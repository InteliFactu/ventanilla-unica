import { asRecord } from '../../../dehu/api/asRecord'
import { readTextOrNull } from '../../../dehu/api/readTextOrNull'
import type { RegistryAnnotation } from '../types/RegistryAnnotation'

/** Map one `anotaciones` item of a `consultaRegistros` entry. */
export const mapRegistryAnnotation = (value: unknown): RegistryAnnotation => {
  const record = asRecord(value)
  return {
    code: readTextOrNull(record?.['cdEstado']),
    description: readTextOrNull(record?.['descripcionCatalogo']),
    at: readTextOrNull(record?.['fechaAnotacion']),
    observations: readTextOrNull(record?.['observaciones']),
    office: readTextOrNull(record?.['dsOrOrigen']),
  }
}
