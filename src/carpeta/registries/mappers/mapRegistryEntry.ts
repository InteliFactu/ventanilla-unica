import { asRecord } from '../../../dehu/api/asRecord'
import { readTextOrNull } from '../../../dehu/api/readTextOrNull'
import { selectLatestAnnotation } from '../selectors/selectLatestAnnotation'
import type { RegistryEntry } from '../types/RegistryEntry'
import { mapRegistryAnnotation } from './mapRegistryAnnotation'
import { mapRegistryList } from './mapRegistryList'
import { mapRegistryParty } from './mapRegistryParty'

/** Map one `asientos` item of `consultaRegistros`; an entry without `numRegistro` is refused. */
export const mapRegistryEntry = (value: unknown): RegistryEntry => {
  const record = asRecord(value) ?? {}
  const number = readTextOrNull(record['numRegistro'])?.trim()
  if (!number) throw new Error('Carpeta: a registry entry had no numRegistro')
  const annotations = mapRegistryList(
    record['anotaciones'],
    mapRegistryAnnotation,
  )
  return {
    number,
    registeredAt: readTextOrNull(record['fechaRegistro']),
    office: readTextOrNull(record['dsOficinaRegistroInicio']),
    exchangeCode: readTextOrNull(record['cdIntercambio']),
    state: selectLatestAnnotation(annotations)?.description ?? null,
    annotations,
    parties: mapRegistryList(record['interesados'], mapRegistryParty),
  }
}
