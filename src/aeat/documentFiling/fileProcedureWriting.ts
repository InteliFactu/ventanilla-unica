import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { attachDocument } from './attachDocument'
import { fetchSignatureScreen } from './fetchSignatureScreen'
import { fetchProcedureForm } from './fetchers/fetchProcedureForm'
import { postFilingSignature } from './fetchers/postFilingSignature'
import { mapProcedureFilingPlan } from './mappers/mapProcedureFilingPlan'
import { parseFilingForm } from './parsers/parseFilingForm'
import { saveFilingReceipt } from './saveFilingReceipt'
import type { DocumentFilingContext } from './types/DocumentFilingContext'
import type { DocumentFilingReceipt } from './types/DocumentFilingReceipt'
import type { ProcedureFilingQuery } from './types/ProcedureFilingQuery'
import { assertSignatureInteresado } from './validators/assertSignatureInteresado'
import { readFilingDocuments } from './validators/readFilingDocuments'

/**
 * `aeat escrito`: file a writing (a solicitud, a recurso) at the AEAT
 * registry under a procedure's trámite when no notification CSV exists. With
 * `nif` the holder files "en representación de terceros" and the signature
 * step must name that NIF as interesado. Without confirmation only the form
 * is opened; confirmed, it attaches, checks step 2 and signs once.
 */
export const fileProcedureWriting = async (
  client: HttpClient,
  query: ProcedureFilingQuery,
  context: DocumentFilingContext,
): Promise<WriteResult<DocumentFilingReceipt>> => {
  const documents = await readFilingDocuments(query.files)
  const form = parseFilingForm(await fetchProcedureForm(client, query.tramite))
  const action = `aeat escrito ${query.tramite}`
  const plan = mapProcedureFilingPlan(form, query, documents)
  if (!context.confirmed)
    return {
      action,
      executed: false,
      plan,
      notes: ['Only the form was opened; --confirmar si files the writing.'],
    }
  let page = form.page
  for (const document of documents)
    page = await attachDocument(client, page, document, query)
  const screen = await fetchSignatureScreen(client, page, query)
  const expected = documents.map((document) => document.name).join(', ')
  if (screen.fileNames.join(', ') !== expected)
    throw new Error(
      `AEAT: the signature step lists ${screen.fileNames.join(', ')} instead of ${expected}; nothing is filed`,
    )
  if (query.nif !== undefined) assertSignatureInteresado(screen, query.nif)
  const answer = await postFilingSignature(client, screen)
  return {
    action,
    executed: true,
    plan,
    receipt: await saveFilingReceipt(client, answer, context.outDir),
    notes: [`Signed as ${screen.signer.nif} ${screen.signer.nombre}.`],
  }
}
