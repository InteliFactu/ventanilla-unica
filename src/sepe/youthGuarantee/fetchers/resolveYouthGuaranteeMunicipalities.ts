import type { HttpClient } from '../../../http/types/HttpClient'
import { selectYouthGuaranteeMunicipality } from '../selectors/selectYouthGuaranteeMunicipality'
import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import { isYouthGuaranteeMunicipalityField } from '../validators/isYouthGuaranteeMunicipalityField'
import { fetchYouthGuaranteeMunicipalities } from './fetchYouthGuaranteeMunicipalities'

export const resolveYouthGuaranteeMunicipalities = async (
  client: HttpClient,
  answers: YouthGuaranteeAnswers,
): Promise<YouthGuaranteeAnswers> => {
  const personal = { ...answers['2'] }
  for (const [name, answer] of Object.entries(personal)) {
    if (!isYouthGuaranteeMunicipalityField(name)) continue
    const province = personal[name.replace(/tcodMunicipio$/, 'tcodProvincia')]
    if (!province || !/^\d{1,2}$/.test(province) || Number(province) === 0)
      throw new Error(
        `Garantía Juvenil: declare a province for ${name} before resolving its municipality`,
      )
    personal[name] = selectYouthGuaranteeMunicipality(
      await fetchYouthGuaranteeMunicipalities(client, province),
      answer,
      name,
    )
  }
  return { ...answers, '2': personal }
}
