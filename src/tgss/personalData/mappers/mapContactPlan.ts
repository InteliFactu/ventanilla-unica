import type { ContactUpdate } from '../types/ContactUpdate'
import type { ImportassPersonalData } from '../types/ImportassPersonalData'
import { mapContactChanges } from './mapContactChanges'
import { mapContactFormFields } from './mapContactFormFields'

/** The `tgss contacto` plan: the holder, each change and the form it would post; empty when nothing changes. */
export const mapContactPlan = (
  data: ImportassPersonalData,
  update: ContactUpdate,
): string[] => {
  const changes = mapContactChanges(data, update)
  if (changes.length === 0) return []
  return [
    `Holder ${data.name} (${data.identifier}, NAF ${data.naf})`,
    ...changes,
    `POST the contact form with ${JSON.stringify(mapContactFormFields(data, update))}`,
  ]
}
