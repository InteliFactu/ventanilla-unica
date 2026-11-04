import type { YouthGuaranteeMunicipality } from '../types/YouthGuaranteeMunicipality'

export const isYouthGuaranteeMunicipality = (
  value: unknown,
): value is YouthGuaranteeMunicipality =>
  typeof value === 'object' &&
  value !== null &&
  'denominacionC' in value &&
  typeof value.denominacionC === 'string' &&
  'idMunicipioC' in value &&
  typeof value.idMunicipioC === 'string' &&
  value.idMunicipioC !== '' &&
  value.idMunicipioC !== '0'
