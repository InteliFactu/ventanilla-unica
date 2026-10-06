import type { UploadedFile } from '../types/UploadedFile'

/**
 * One `fFichero` entry as the page's `ficherosAlmacenados` callback builds it:
 * collection, key, name, content type, AODIT hash, size and description joined
 * by `#`, closed by `¬`. The description is the file name, as in the page.
 */
export const fileEntryFromUpload = (file: UploadedFile): string =>
  [
    file.coleccion,
    file.clave,
    file.nombre,
    file.contentType,
    file.huellaAodit,
    file.size,
    file.nombre,
  ].join('#') + '¬'
