import { recordLengthOf } from '../mappers/recordLengthOf'
import type { BulkFile } from '../types/BulkFile'

/**
 * Split a BOE informative file as TGVI Online's page does: the type 1 record
 * names model, year and declarant; every following record must be a type 2
 * of the same model, year and declarant. Line breaks between records are
 * dropped, so files with and without CRLF read alike.
 */
export const parseBulkFile = (content: string): BulkFile => {
  const flat = content.replace(/\r?\n/g, '')
  const modelo = flat.slice(1, 4)
  const ejercicio = flat.slice(4, 8)
  const recordLength = recordLengthOf(modelo, ejercicio)
  if (flat.charAt(0) !== '1' || flat.length % recordLength !== 0)
    throw new Error(
      `TGVI: the file does not start with a type 1 record or is not made of ${String(recordLength)}-character records`,
    )
  const header = flat.slice(0, recordLength)
  const records: string[] = []
  for (let start = recordLength; start < flat.length; start += recordLength)
    records.push(flat.slice(start, start + recordLength))
  const prefix = `2${header.slice(1, 17)}`
  const stray = records.findIndex((record) => !record.startsWith(prefix))
  if (stray !== -1)
    throw new Error(
      `TGVI: record ${String(stray + 2)} is not a type 2 record of ${prefix.slice(1)}`,
    )
  return {
    modelo,
    ejercicio,
    nif: header.slice(8, 17),
    nombre: header.slice(17, 57).trim(),
    recordLength,
    header,
    records,
  }
}
