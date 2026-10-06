import { htmlToText } from '../../../html/htmlToText'
import type { AeatPage } from '../types/AeatPage'
import type { FilingForm } from '../types/FilingForm'
import { readFilingAlert } from './readFilingAlert'
import { readFilingParty } from './readFilingParty'
import { readFormFields } from './readFormFields'
import { readLabeledValue } from './readLabeledValue'

/** The step-1 form a CSV resolves to; throws with the registry's own words when it refused the CSV. */
export const parseFilingForm = (page: AeatPage): FilingForm => {
  const text = htmlToText(page.html)
  const tramite = readLabeledValue(text, 'Trámite')
  const interesado = readFilingParty(text, 'Interesado')
  if (!tramite || !interesado)
    throw new Error(
      `AEAT: the registry did not open a filing form for this CSV (${readFilingAlert(page.html) ?? 'no reason given'})`,
    )
  return {
    page,
    tramite,
    procedimiento: readLabeledValue(text, 'Procedimiento') ?? '',
    expediente: readFormFields(page.html, 'Form')['fExpediente'] ?? '',
    interesado,
    representante: readFilingParty(text, 'Representante'),
    titular: readFilingParty(text, 'Titular'),
  }
}
