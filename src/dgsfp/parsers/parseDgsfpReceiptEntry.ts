import type { DgsfpReceiptEntry } from '../types/DgsfpReceiptEntry'

export const parseDgsfpReceiptEntry = (value: unknown): DgsfpReceiptEntry => {
  if (typeof value !== 'object' || value === null)
    throw new Error('DGSFP: malformed receipt entry')

  const { numReg, anioReg, fecha } = value as Record<string, unknown>
  if (
    typeof numReg !== 'string' ||
    !numReg.trim() ||
    typeof anioReg !== 'string' ||
    !/^\d{4}$/.test(anioReg) ||
    typeof fecha !== 'string' ||
    !fecha.trim()
  )
    throw new Error('DGSFP: malformed receipt entry')

  return {
    registryNumber: numReg.trim(),
    registryYear: anioReg,
    registeredAt: fecha.trim(),
  }
}
