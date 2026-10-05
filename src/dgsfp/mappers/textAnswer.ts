import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'

/** A typed or chosen value as a non-file control sets it: `multiple` and `tabla` become undefined. */
export const textAnswer = (
  value: string,
  key = '',
): Partial<DgsfpFieldValue> => ({
  key,
  value,
  multiple: undefined,
  tabla: undefined,
})
