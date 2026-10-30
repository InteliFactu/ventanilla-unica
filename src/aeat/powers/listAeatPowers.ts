import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { fetchPowerList } from './fetchers/fetchPowerList'
import { parsePowerColumns } from './parsers/parsePowerColumns'
import { parsePowerRows } from './parsers/parsePowerRows'
import { readPowerListHolder } from './parsers/readPowerListHolder'
import { powerListPageSize } from './powerListPageSize'
import type { AeatPowerDirection } from './types/AeatPowerDirection'
import type { AeatPowersReport } from './types/AeatPowersReport'
import { isEmptyPowerList } from './validators/isEmptyPowerList'

/**
 * `aeat apoderamientos`: the Registro de apoderamientos of the certificate
 * holder, either the powers it granted or the ones granted to it. Read-only;
 * refuses a page for another holder, a page that is neither empty nor a list,
 * and a full page it cannot see past.
 */
export const listAeatPowers = async (
  client: HttpClient,
  nif: string,
  direction: AeatPowerDirection,
): Promise<AeatPowersReport> => {
  await openAeatSession(client)
  const html = await fetchPowerList(client, direction)
  const holder = readPowerListHolder(html)
  if (holder !== nif)
    throw new Error(
      `AEAT: the apoderamientos list belongs to ${holder ?? 'nobody'}, not --nif ${nif}`,
    )
  const powers = isEmptyPowerList(html)
    ? []
    : parsePowerRows(html, parsePowerColumns(html))
  if (powers.length === 0 && !isEmptyPowerList(html))
    throw new Error('AEAT: the apoderamientos page is neither empty nor a list')
  if (powers.length >= powerListPageSize)
    throw new Error(
      `AEAT: ${String(powerListPageSize)} or more apoderamientos; the next pages are not read yet`,
    )
  return { nif, direction, count: powers.length, powers }
}
