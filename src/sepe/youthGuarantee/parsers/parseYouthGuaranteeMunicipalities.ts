import type { YouthGuaranteeMunicipality } from '../types/YouthGuaranteeMunicipality'
import { isYouthGuaranteeMunicipality } from '../validators/isYouthGuaranteeMunicipality'

export const parseYouthGuaranteeMunicipalities = (
  text: string,
): readonly YouthGuaranteeMunicipality[] => {
  try {
    const value: unknown = JSON.parse(text)
    if (
      typeof value === 'object' &&
      value !== null &&
      'listadoMunicipios' in value &&
      Array.isArray(value.listadoMunicipios) &&
      value.listadoMunicipios.every(isYouthGuaranteeMunicipality)
    )
      return value.listadoMunicipios
  } catch {
    /* A login page or error envelope is not a municipality list. */
  }
  throw new Error(
    'Garantía Juvenil: invalid municipality response; no address was submitted',
  )
}
