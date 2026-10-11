import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { importassUrls } from '../session/importassUrls'
import { mapContactChanges } from './mappers/mapContactChanges'
import { mapContactFormFields } from './mappers/mapContactFormFields'
import { mapContactPlan } from './mappers/mapContactPlan'
import { parsePersonalDataPage } from './parsers/parsePersonalDataPage'
import { readPersonalData } from './readPersonalData'
import type { ContactReceipt } from './types/ContactReceipt'
import type { ContactUpdate } from './types/ContactUpdate'

/**
 * Change the phones and e-mail the Seguridad Social uses to reach the holder
 * (Importass "Modificar datos de contacto"). The plan reads the page and lists
 * each change; nothing is posted when the page already holds the values. With
 * confirmation the modal's form is posted and the answer, which re-renders the
 * page, must show the new values or the run fails.
 */
export const updateContactData = async (
  client: HttpClient,
  update: ContactUpdate,
  confirmed: boolean,
): Promise<WriteResult<ContactReceipt>> => {
  const action = 'tgss contacto'
  const { data, contactForm } = await readPersonalData(client)
  const plan = mapContactPlan(data, update)
  if (plan.length === 0) {
    const holder = `${data.name} (${data.identifier}, NAF ${data.naf})`
    const done = `${holder}: Importass already holds these contact data; nothing to change`
    return { action, executed: false, plan: [done], notes: [] }
  }
  if (!confirmed) {
    const note =
      'Only the page was read; --confirmar si saves the contact data.'
    return { action, executed: false, plan, notes: [note] }
  }
  const fields = mapContactFormFields(data, update)
  const referer = importassUrls.personalData
  const saved = await postForm(client, contactForm, fields, { referer })
  const after = parsePersonalDataPage(saved.text, saved.url).data
  if (mapContactChanges(after, update).length > 0)
    throw new Error(
      `tgss contacto: the page still shows ${after.mobile} / ${after.email} after saving`,
    )
  const { landline, mobile, email } = after
  return {
    action,
    executed: true,
    plan,
    receipt: { after: { landline, mobile, email } },
    notes: [],
  }
}
