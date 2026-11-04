import { normalizeYouthGuaranteeMunicipality } from '../mappers/normalizeYouthGuaranteeMunicipality'
import type { YouthGuaranteeMunicipality } from '../types/YouthGuaranteeMunicipality'

export const selectYouthGuaranteeMunicipality = (
  municipalities: readonly YouthGuaranteeMunicipality[],
  answer: string,
  field: string,
): string => {
  const matches = municipalities.filter(
    (item) =>
      item.idMunicipioC === answer ||
      normalizeYouthGuaranteeMunicipality(item.denominacionC) ===
        normalizeYouthGuaranteeMunicipality(answer),
  )
  if (matches.length !== 1 || !matches[0])
    throw new Error(
      `Garantía Juvenil: municipality for ${field} is ${matches.length === 0 ? 'missing from the province list' : 'ambiguous'}; provide a unique name or offered municipality ID`,
    )
  return matches[0].idMunicipioC
}
