import type { DraftFileHolder } from '../types/DraftFileHolder'

/**
 * Read the holder off the identification page of a 303 file: after the
 * `<T30301000>` tag come one complementary-page flag, one declaration type,
 * the 9-character NIF and the 80-character name.
 */
export const parseDraftFileHolder = (file: Buffer): DraftFileHolder => {
  const text = file.toString('latin1')
  const start = text.indexOf('<T30301000>')
  if (start < 0)
    throw new Error('the file has no 303 identification page <T30301000>')
  const nif = text.slice(start + 13, start + 22).trim()
  const nombre = text.slice(start + 22, start + 102).trim()
  if (!nif || !nombre)
    throw new Error('the 303 identification page has no NIF or name')
  return { nif, nombre }
}
