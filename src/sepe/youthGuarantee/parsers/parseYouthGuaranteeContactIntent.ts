import type { YouthGuaranteeContactIntent } from '../types/YouthGuaranteeContactIntent'

export const parseYouthGuaranteeContactIntent = (
  value: string | undefined,
  flag: string,
): YouthGuaranteeContactIntent | undefined => {
  if (value === undefined || value === 'solicitar' || value === 'reutilizar')
    return value
  throw new Error(
    `Garantía Juvenil: --${flag} accepts only solicitar or reutilizar`,
  )
}
