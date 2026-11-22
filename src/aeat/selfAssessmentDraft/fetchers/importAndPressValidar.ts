import { noticesHaveNoError } from '../mappers/noticesHaveNoError'
import { parseDraftNotices } from '../parsers/parseDraftNotices'
import type { FormValidation } from '../types/FormValidation'
import type { PresentationForm } from '../types/PresentationForm'
import { importDraftFile } from './importDraftFile'
import { pressDraftButton } from './pressDraftButton'

/** Import the file into an open form and press Validar, stopping at the first step with an error. */
export const importAndPressValidar = async (
  open: PresentationForm,
  file: Buffer,
): Promise<FormValidation> => {
  const importNotices = await importDraftFile(
    open.session,
    open.form.importUuid,
    file,
  )
  if (!noticesHaveNoError(importNotices))
    return { passed: false, notices: importNotices }
  const notices = parseDraftNotices(
    await pressDraftButton(open.session, open.validateUuid),
  )
  return { passed: noticesHaveNoError(notices), notices }
}
