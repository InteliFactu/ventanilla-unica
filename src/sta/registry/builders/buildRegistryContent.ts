import type { RegistryPerson } from '../types/RegistryPerson'
import type { RegistrySchema } from '../types/RegistrySchema'
import { buildRegistryData } from './buildRegistryData'
import { buildRegistryParties } from './buildRegistryParties'

/** Everything the saves carry besides the documents: the holder, the form values and the notice e-mail. */
export const buildRegistryContent = (
  person: RegistryPerson,
  schema: RegistrySchema,
  form: {
    readonly unitKey: string
    readonly phone: string
    readonly subject: string
    readonly notificationEmail: string
  },
): {
  readonly parties: Readonly<Record<string, unknown>>
  readonly data: readonly Readonly<Record<string, unknown>>[]
  readonly notificationEmail: string
} => ({
  parties: buildRegistryParties(person),
  data: buildRegistryData(schema, {
    CBDIR3: form.unitKey,
    TEEFONO: form.phone,
    ANNOT_TEXT_EXTRACT: form.subject,
  }),
  notificationEmail: form.notificationEmail,
})
