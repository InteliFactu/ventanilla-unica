import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { attachDocument } from './attachDocument'
import { fetchSignatureScreen } from './fetchSignatureScreen'
import { postFilingSignature } from './fetchers/postFilingSignature'
import { mapDocumentFilingPlan } from './mappers/mapDocumentFilingPlan'
import { prepareDocumentFiling } from './prepareDocumentFiling'
import { saveFilingReceipt } from './saveFilingReceipt'
import type { DocumentFilingContext } from './types/DocumentFilingContext'
import type { DocumentFilingQuery } from './types/DocumentFilingQuery'
import type { DocumentFilingReceipt } from './types/DocumentFilingReceipt'

/**
 * `aeat aportar`: file documents (alegaciones, a reply to a requerimiento)
 * at the AEAT registry against the CSV of the notification they answer.
 * Without confirmation only the form is opened and the plan printed; nothing
 * is uploaded. Confirmed, the files are uploaded and attached, the step-2
 * screen is checked to list exactly them and to sign as the holder, and the
 * firma básica registers the filing.
 */
export const fileDocumentsWithCsv = async (
  client: HttpClient,
  query: DocumentFilingQuery,
  context: DocumentFilingContext,
): Promise<WriteResult<DocumentFilingReceipt>> => {
  const { form, documents } = await prepareDocumentFiling(client, query)
  const action = `aeat aportar ${query.csv}`
  const plan = mapDocumentFilingPlan(form, query.subject, documents)
  if (!context.confirmed)
    return {
      action,
      executed: false,
      plan,
      notes: ['Only the form was opened; --confirmar si files the documents.'],
    }
  let page = form.page
  for (const document of documents)
    page = await attachDocument(client, page, document, query.subject)
  const screen = await fetchSignatureScreen(client, page, query)
  const expected = documents.map((document) => document.name).join(', ')
  if (screen.fileNames.join(', ') !== expected)
    throw new Error(
      `AEAT: the signature step lists ${screen.fileNames.join(', ')} instead of ${expected}; nothing is filed`,
    )
  const answer = await postFilingSignature(client, screen)
  return {
    action,
    executed: true,
    plan,
    receipt: await saveFilingReceipt(client, answer, context.outDir),
    notes: [`Signed as ${screen.signer.nif} ${screen.signer.nombre}.`],
  }
}
