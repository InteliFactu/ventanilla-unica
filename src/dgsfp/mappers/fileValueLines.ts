import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'

/** A file control's lines in the request document: name and hash of every file, then the remarks if any. */
export const fileValueLines = (field: DgsfpFieldValue): readonly string[] => [
  ...(field.multiple ?? []).flatMap((file) => [
    `Archivo: ${file.value}`,
    `Hash: ${file.key}`,
  ]),
  ...(field.value === '' ? [] : [`Observaciones: ${field.value}`]),
]
