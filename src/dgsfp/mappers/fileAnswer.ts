import type { DgsfpAttachment } from '../types/DgsfpAttachment'
import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'

/** A file control holding one uploaded PDF, or none with only the "Observaciones" text the control allows instead. */
export const fileAnswer = (
  attachment: DgsfpAttachment | undefined,
  remarks = '',
): Partial<DgsfpFieldValue> => ({
  value: remarks,
  multiple: attachment
    ? [{ key: attachment.hash, value: attachment.name }]
    : [],
})
