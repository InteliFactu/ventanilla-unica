import type { HttpClient } from '../../http/types/HttpClient'
import { documentFilingUrls } from './documentFilingUrls'
import { postRegistryForm } from './fetchers/postRegistryForm'
import { uploadFilingFile } from './fetchers/uploadFilingFile'
import { fileEntryFromUpload } from './mappers/fileEntryFromUpload'
import { readFilingAlert } from './parsers/readFilingAlert'
import { readFormFields } from './parsers/readFormFields'
import type { AeatPage } from './types/AeatPage'
import type { FilingDocument } from './types/FilingDocument'

/**
 * Upload one document and attach it to the step-1 form, as the dialog's
 * callback does: `fFichero` carries the stored file and `fTipoFichero` its
 * type, and `FGGraba` answers the same form listing it. Still nothing filed.
 */
export const attachDocument = async (
  client: HttpClient,
  page: AeatPage,
  document: FilingDocument,
  subject: string,
): Promise<AeatPage> => {
  const uploaded = await uploadFilingFile(client, document)
  const next = await postRegistryForm(
    client,
    documentFilingUrls.attach,
    {
      ...readFormFields(page.html, 'Form'),
      fAsunto: subject,
      fTipoFichero: document.type,
      fFichero: fileEntryFromUpload(uploaded),
    },
    page.url,
  )
  if (
    !readFormFields(next.html, 'Form2')['fclavesAODITForm2']?.includes(
      uploaded.clave,
    )
  )
    throw new Error(
      `AEAT: ${document.name} was stored but not attached (${readFilingAlert(next.html) ?? 'no reason given'})`,
    )
  return next
}
