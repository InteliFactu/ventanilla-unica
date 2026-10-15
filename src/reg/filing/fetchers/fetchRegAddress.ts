import type { HttpClient } from '../../../http/types/HttpClient'
import { callRegApi } from '../../session/fetchers/callRegApi'
import { selectCatalogEntry } from '../selectors/selectCatalogEntry'
import type { ProvinceEntry } from '../types/ProvinceEntry'
import type { RegAddress } from '../types/RegAddress'
import type { RegFilingQuery } from '../types/RegFilingQuery'
import type { TownEntry } from '../types/TownEntry'
import type { ViaTypeEntry } from '../types/ViaTypeEntry'

/** Resolve the street type, province and town against the API's DIR3 catalogues (Spain only). */
export const fetchRegAddress = async (
  client: HttpClient,
  token: string,
  query: RegFilingQuery,
): Promise<RegAddress> => {
  const viaTypes = (await callRegApi(
    client,
    token,
    'dir3/typeVia',
  )) as ViaTypeEntry[]
  const provinces = (await callRegApi(
    client,
    token,
    'dir3/province',
  )) as ProvinceEntry[]
  const province = selectCatalogEntry(
    provinces.map((item) => ({
      code: item.cdProvincia,
      name: item.dsProvincia,
    })),
    query.province,
    'province',
  )
  const towns = (await callRegApi(
    client,
    token,
    `dir3/province/${province.code}/location`,
  )) as TownEntry[]
  return {
    viaType: selectCatalogEntry(
      viaTypes.map((item) => ({ code: item.cdTipoVia, name: item.dsTipoVia })),
      query.viaType,
      'street type',
    ),
    via: query.via,
    zipCode: query.zipCode,
    province,
    town: selectCatalogEntry(
      towns.map((item) => ({ code: item.cdLocalidad, name: item.dsLocalidad })),
      query.town,
      'town',
    ),
  }
}
