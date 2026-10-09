import { selectRepresented } from '../selectors/selectRepresented'
import type { RelecDocument } from '../types/RelecDocument'
import type { RelecForm } from '../types/RelecForm'
import type { RelecPlan } from '../types/RelecPlan'
import type { RelecQuery } from '../types/RelecQuery'

/** The structured plan: who files for whom, the reference, the contact and each document with its hash. */
export const mapRelecPlan = (
  host: string,
  query: RelecQuery,
  form: RelecForm,
  documents: readonly RelecDocument[],
): RelecPlan => {
  const represented = selectRepresented(form)
  const email = query.email ?? form.contact.email
  if (email === undefined)
    throw new Error(
      '--correo is required: the form prefills no e-mail and electronic notification needs one',
    )
  return {
    host,
    procedure: form.fields['solicituddesc']?.trim() ?? '',
    reference: query.reference,
    information: query.information ?? '',
    representative: form.holder,
    represented: {
      name: represented.name,
      nif: represented.nif,
      dboid: represented.dboid,
    },
    notification: 'electronica',
    email,
    phone: query.phone ?? form.contact.phone,
    documents,
  }
}
