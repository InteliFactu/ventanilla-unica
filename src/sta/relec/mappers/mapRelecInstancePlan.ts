import { parseRelecSlots } from '../parsers/parseRelecSlots'
import { parseRelecVariables } from '../parsers/parseRelecVariables'
import { selectInstanceParty } from '../selectors/selectInstanceParty'
import { selectRelecSlot } from '../selectors/selectRelecSlot'
import type { RelecFile } from '../types/RelecFile'
import type { RelecForm } from '../types/RelecForm'
import type { RelecInstancePlan } from '../types/RelecInstancePlan'
import type { RelecInstanceQuery } from '../types/RelecInstanceQuery'

/**
 * The structured plan: who files for whom, the asunto, the contact and each
 * document with its row. The form must still carry the "Asunto" field
 * (`ANNOT_TEXT_EXTRACT`), or the procedure changed and nothing is planned.
 */
export const mapRelecInstancePlan = (
  host: string,
  query: RelecInstanceQuery,
  form: RelecForm,
  files: readonly RelecFile[],
): RelecInstancePlan => {
  if (
    !parseRelecVariables(form.fields).some(
      (variable) => variable.name === 'ANNOT_TEXT_EXTRACT',
    )
  )
    throw new Error(
      'the Instancia general form no longer carries its "Asunto" field (ANNOT_TEXT_EXTRACT); nothing was planned',
    )
  const slots = parseRelecSlots(form.fields)
  const documents = files.map((file, index) => ({
    ...file,
    slot: selectRelecSlot(slots, query.rows[index] ?? ''),
  }))
  const filled = new Set(documents.map((document) => document.slot.dboid))
  return {
    host,
    procedure: form.fields['solicituddesc']?.trim() ?? '',
    subject: query.subject,
    filer: form.holder,
    represented: selectInstanceParty(form, query.represented),
    email: query.email ?? form.contact.email,
    phone: query.phone ?? form.contact.phone,
    documents,
    missingRequired: slots
      .filter((slot) => slot.required && !filled.has(slot.dboid))
      .map((slot) => slot.name),
  }
}
