import type { DraftFileHeader } from '../types/DraftFileHeader'

/**
 * Read model, exercise and period off the file's opening tag (`<T` + model +
 * the "0" of a declaration + exercise + period), so the simulator of that
 * exercise is the one asked.
 */
export const parseDraftFileHeader = (file: Buffer): DraftFileHeader => {
  const match = /^<T(\d{3})0(\d{4})(\w{2})/.exec(
    file.subarray(0, 16).toString('latin1'),
  )
  if (!match?.[1] || !match[2] || !match[3])
    throw new Error(
      'the file does not open with an AEAT model tag such as <T303020263T0000>',
    )
  return { modelo: match[1], ejercicio: match[2], periodo: match[3] }
}
