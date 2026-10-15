import { decodeJsUnicodeEscapes } from '../../../html/mappers/decodeJsUnicodeEscapes'
import type { RelecSlot } from '../types/RelecSlot'

/**
 * The document rows of a Relec form from its TramitaSign inputs: each row
 * declares `<dboid>_NEWDocReq` and its name, description, type and whether
 * the sede requires it. The sede's script leaves `\uXXXX` escapes in the
 * values, decoded here.
 */
export const parseRelecSlots = (
  fields: Readonly<Record<string, string>>,
): readonly RelecSlot[] =>
  Object.keys(fields).flatMap((key) => {
    const dboid = /^(\d+)_NEWDocReq$/.exec(key)?.[1]
    if (dboid === undefined) return []
    const field = (suffix: string): string =>
      decodeJsUnicodeEscapes(fields[`${dboid}_NEW${suffix}`] ?? '')
    return [
      {
        dboid,
        name: field('name'),
        description: field('description'),
        required: field('required') === 'true',
        typeDboid: field('tipo'),
      },
    ]
  })
