import { asRecord } from '../../../dehu/api/asRecord'
import { readTextOrNull } from '../../../dehu/api/readTextOrNull'
import type { RegistryParty } from '../types/RegistryParty'

/** Map one `interesados` item: the name and both surnames joined, and the identity document. */
export const mapRegistryParty = (value: unknown): RegistryParty => {
  const record = asRecord(value)
  const name = [
    'nombre_interesado',
    'apellido1_interesado',
    'apellido2_interesado',
  ]
    .map((key) => readTextOrNull(record?.[key]))
    .filter((part) => part !== null)
    .join(' ')
  return {
    name,
    document: readTextOrNull(record?.['num_doc_ident_interesado']),
  }
}
