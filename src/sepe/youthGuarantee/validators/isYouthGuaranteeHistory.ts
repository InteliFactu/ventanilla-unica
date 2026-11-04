import type { YouthGuaranteeHistory } from '../types/YouthGuaranteeHistory'

export const isYouthGuaranteeHistory = (
  value: unknown,
): value is YouthGuaranteeHistory => {
  if (!value || typeof value !== 'object') return false
  return (
    'recordsTotal' in value &&
    typeof value.recordsTotal === 'number' &&
    'data' in value &&
    Array.isArray(value.data)
  )
}
