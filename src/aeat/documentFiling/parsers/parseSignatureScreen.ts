import { parseSignatureIdentity } from '../../appearance/parsers/parseSignatureIdentity'
import type { AeatPage } from '../types/AeatPage'
import type { SignatureScreen } from '../types/SignatureScreen'
import { readFilingAlert } from './readFilingAlert'
import { readFormFields } from './readFormFields'

/**
 * Step 2, "Firma y envío de la solicitud". `fFicherosTotales` lists every
 * attached file as six `@`-separated values (name, description, type, key,
 * hash, link), all files in one flat `@` list.
 */
export const parseSignatureScreen = (page: AeatPage): SignatureScreen => {
  if (!page.html.includes('Firma y Env'))
    throw new Error(
      `AEAT: the registry did not reach the signature step (${readFilingAlert(page.html) ?? 'no reason given'})`,
    )
  const fields = readFormFields(page.html, 'Form')
  const values = (fields['fFicherosTotales'] ?? '').split('@')
  const fileNames = values.filter(
    (value, index) => index % 6 === 0 && value !== '',
  )
  return { page, fields, signer: parseSignatureIdentity(page.html), fileNames }
}
