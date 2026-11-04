import { isYouthGuaranteeHistory } from '../validators/isYouthGuaranteeHistory'

export const readYouthGuaranteeHistoryCount = (json: string): number => {
  const value: unknown = JSON.parse(json)
  if (!isYouthGuaranteeHistory(value))
    throw new Error(
      'Garantía Juvenil: unrecognized inscription history response',
    )
  if (value.errorCustom !== null && value.errorCustom !== undefined)
    throw new Error(
      'Garantía Juvenil: inscription history returned an error; registration status is unverified',
    )
  if (
    !Number.isSafeInteger(value.recordsTotal) ||
    value.recordsTotal < 0 ||
    value.data.length > value.recordsTotal
  )
    throw new Error(
      'Garantía Juvenil: inconsistent inscription history response',
    )
  return value.recordsTotal
}
