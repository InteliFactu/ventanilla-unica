import { selectRelecUploadMaxSize } from '../selectors/selectRelecUploadMaxSize'
import type { RelecUploadTarget } from '../types/RelecUploadTarget'

/** Check the selected slot's own upload limit before the first upload. */
export const assertRelecUploadSize = (target: RelecUploadTarget): void => {
  const maxSize = selectRelecUploadMaxSize(target)
  if (target.document.bytes > maxSize * 1024)
    throw new Error(
      `${target.document.name} exceeds slot ${String(target.slot)} limit of ${String(maxSize)} KB`,
    )
}
