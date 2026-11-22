import type { DraftFileHolder } from '../types/DraftFileHolder'
import type { PresentationCheck } from '../types/PresentationCheck'

/** Refuse to sign a dialog that is not for the file's declarant, or whose signed text is not the file's. */
export const validatePresentationCheck = (
  check: PresentationCheck,
  holder: DraftFileHolder,
): void => {
  if (
    !check.onBehalfOf.startsWith(holder.nif) ||
    !check.signedText.includes(holder.nif)
  )
    throw new Error(
      `AEAT: the signature dialog is for ${check.onBehalfOf}, not ${holder.nif}`,
    )
}
