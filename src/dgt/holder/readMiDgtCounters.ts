import type { HttpClient } from '../../http/types/HttpClient'
import { dgtUrls } from '../session/dgtUrls'
import { fetchMiDgtCounter } from './fetchers/fetchMiDgtCounter'
import { mapMiDgtCounters } from './mappers/mapMiDgtCounters'
import { readDgtJson } from './parsers/readDgtJson'
import type { DgtCounters } from './types/DgtCounters'

/**
 * The Mi DGT home counters (vehicles, sanctions, points, licences, registry
 * entries, appointments, representations) of a logged-in holder. The home is
 * loaded first: before it, the same calls answer "-" or an HTML page.
 */
export const readMiDgtCounters = async (
  client: HttpClient,
): Promise<DgtCounters> => {
  await client.request(dgtUrls.miDgtHome)
  const names = [
    'vehiculos',
    'sanciones',
    'registros',
    'puntos',
    'permisos',
    'representados',
    'citas',
  ]
  let merged: Readonly<Record<string, unknown>> = {}
  for (const name of names)
    merged = {
      ...merged,
      ...readDgtJson(await fetchMiDgtCounter(client, name), `${name} counter`),
    }
  return mapMiDgtCounters(merged)
}
