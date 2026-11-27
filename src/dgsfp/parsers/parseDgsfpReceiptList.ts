import type { DgsfpReceiptEntry } from '../types/DgsfpReceiptEntry'
import { parseDgsfpReceiptEntry } from './parseDgsfpReceiptEntry'

export const parseDgsfpReceiptList = (
  text: string,
): readonly DgsfpReceiptEntry[] => {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new Error('DGSFP: the receipt list is not valid JSON')
  }
  if (!Array.isArray(value)) throw new Error('DGSFP: malformed receipt list')
  return value.map(parseDgsfpReceiptEntry)
}
