/** A non-empty string as is; anything else, including the empty string, as null. */
export const readTextOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value !== '' ? value : null
