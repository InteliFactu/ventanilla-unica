import type { UploadedFile } from '../types/UploadedFile'

/**
 * The Fine Uploader answer of `UploadSv`: `success` is the string "true", and
 * the reference the registry form needs is the collection, key, AODIT hash and
 * zero-padded size it returns.
 */
export const parseUploadAnswer = (text: string): UploadedFile => {
  let answer: Record<string, unknown>
  try {
    answer = JSON.parse(text) as Record<string, unknown>
  } catch {
    throw new Error(`AEAT: the upload answered no JSON (${text.slice(0, 120)})`)
  }
  const value = (name: string): string =>
    typeof answer[name] === 'string' ? answer[name] : ''
  if (value('success') !== 'true' || !value('clave'))
    throw new Error(
      `AEAT: the upload was refused (${value('error') || text.slice(0, 120)})`,
    )
  return {
    coleccion: value('coleccion'),
    clave: value('clave'),
    nombre: value('nombre'),
    contentType: value('contentType'),
    huellaAodit: value('huellaAodit'),
    size: value('size'),
  }
}
