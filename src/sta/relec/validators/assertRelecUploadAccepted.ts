import type { HttpResponse } from '../../../http/types/HttpResponse'
import { mapShellArgument } from '../mappers/mapShellArgument'
import { isRelecSizeAlert } from './isRelecSizeAlert'

/**
 * Check the FileUploader answer, a script calling `parent.uploadEnd()`. Its
 * size alert is reported as a refused PDF: `assertRelecFiles` already
 * held every file under the 50000 KB limit, so the cause is the file's content,
 * most likely an existing signature field or form. The suggested command reads
 * the holder's own `sourcePath`, quoted, since `uploadName` is only the
 * sanitised name the sede sees.
 */
export const assertRelecUploadAccepted = (
  response: HttpResponse,
  uploadName: string,
  sourcePath: string,
): void => {
  if (isRelecSizeAlert(response.text))
    throw new Error(
      `the sede refused the PDF ${uploadName} (likely an existing signature or form, not its size); flatten it and retry, e.g. gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -o flat.pdf ${mapShellArgument(sourcePath)}`,
    )
  if (!response.text.includes('uploadEnd'))
    throw new Error(
      `FileUploader refused ${uploadName} (${String(response.status)}): ${response.text.slice(0, 200)}`,
    )
}
