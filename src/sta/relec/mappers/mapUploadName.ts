import { basename } from 'node:path'

/**
 * The name the sede's uploader keeps for a file: `documentSignSend.jsp`
 * strips everything but `[a-zA-Z0-9-_.]` before it hex-encodes the name into
 * `FileUploader?file=` and passes it to `AutofirmaDownload10`.
 */
export const mapUploadName = (path: string): string => {
  const name = basename(path).replaceAll(/[^\w.-]/g, '')
  if (name === '' || name === '.pdf')
    throw new Error(
      `${basename(path)}: no usable characters left in the file name`,
    )
  return name
}
