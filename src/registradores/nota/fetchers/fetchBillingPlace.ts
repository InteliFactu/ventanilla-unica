import { selectOptionByLabel } from '../../../html/selectors/selectOptionByLabel'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { BillingPlace } from '../types/BillingPlace'
import type { CompanyValidation } from '../types/CompanyValidation'
import { fetchSiteJson } from './fetchSiteJson'

/**
 * The billing province and town codes, read with the identification page's
 * own helpers: `api/validate/sociedad` names the company's province (from the
 * AEAT census) and `api/location/towns` lists its towns as `{value,label}`.
 */
export const fetchBillingPlace = async (
  client: HttpClient,
  nif: string,
  town: string,
): Promise<BillingPlace> => {
  const validation = (await fetchSiteJson(
    client,
    `api/validate/sociedad?identificationNumber=${encodeURIComponent(nif)}`,
  )) as CompanyValidation
  const province = validation.provinceCodes?.[0]
  if (province === undefined)
    throw new Error(`registradores: the sede knows no province for ${nif}`)
  const towns = (await fetchSiteJson(
    client,
    `api/location/towns?province=${String(province)}`,
  )) as readonly Record<'value' | 'label', unknown>[]
  const match = selectOptionByLabel(
    towns.map((option) => ({
      value: String(option.value),
      label: String(option.label),
    })),
    town,
  )
  if (!match)
    throw new Error(
      `registradores: no town "${town}" in province ${String(province)}; pass --municipio`,
    )
  return {
    provinceCode: String(province),
    townCode: match.value,
    townName: match.label,
  }
}
