import type { RegistryContent } from '../types/RegistryContent'
import type { RegistryFormValues } from '../types/RegistryFormValues'
import type { RegistryPerson } from '../types/RegistryPerson'
import type { RegistrySchema } from '../types/RegistrySchema'
import { buildRegistryData } from './buildRegistryData'
import { buildRegistryParties } from './buildRegistryParties'

/** Everything the saves carry besides the documents: the holder, the form values and the notice e-mail. */
export const buildRegistryContent = (
  person: RegistryPerson,
  schema: RegistrySchema,
  form: RegistryFormValues,
): RegistryContent => ({
  parties: buildRegistryParties(person),
  data: buildRegistryData(schema, {
    CBDIR3: form.unitKey,
    TEEFONO: form.phone,
    ANNOT_TEXT_EXTRACT: form.subject,
  }),
  notificationEmail: form.notificationEmail,
})
