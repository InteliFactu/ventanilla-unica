import { resolve } from 'node:path'

import type { YouthGuaranteeVerificationFiles } from '../types/YouthGuaranteeVerificationFiles'

/** Validate before saving any wizard step or requesting a real message. */
export const validateYouthGuaranteeVerificationFiles = (
  files: YouthGuaranteeVerificationFiles,
): void => {
  if (!files.pinFile?.trim() || !files.linkFile?.trim())
    throw new Error(
      'Garantía Juvenil: confirmed inscription requires --pin-fichero and --enlace-fichero',
    )
  if (resolve(files.pinFile) === resolve(files.linkFile))
    throw new Error(
      'Garantía Juvenil: --pin-fichero and --enlace-fichero must be different files',
    )
}
