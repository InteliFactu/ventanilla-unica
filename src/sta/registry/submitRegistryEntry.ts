import type { HttpClient } from '../../http/types/HttpClient'
import { buildRegistryBody } from './builders/buildRegistryBody'
import { saveRegistryRequest } from './fetchers/saveRegistryRequest'
import { signRegistryForm } from './fetchers/signRegistryForm'
import { uploadRegistryFile } from './fetchers/uploadRegistryFile'
import { mapRegistryAnswer } from './mappers/mapRegistryAnswer'
import { mapUploadToDocument } from './mappers/mapUploadToDocument'
import type { RegistryContent } from './types/RegistryContent'
import type { RegistrySubmitTarget } from './types/RegistrySubmitTarget'
import type { StaRegistryReceipt } from './types/StaRegistryReceipt'

/**
 * The write half, in the SPA's order: a draft save, the uploads, a draft save
 * listing them, the `sign` save that prepares the registry form, the form
 * signature, and the submission (`mode: ""`). Uploads go one at a time.
 */
export const submitRegistryEntry = async (
  client: HttpClient,
  target: RegistrySubmitTarget,
  content: RegistryContent,
  paths: readonly string[],
): Promise<StaRegistryReceipt> => {
  const { session, slot, identity } = target
  const draft = { parties: content.parties, data: content.data }
  await saveRegistryRequest(
    client,
    session,
    buildRegistryBody(session, slot, { ...draft, documents: [] }, 'draft'),
  )
  const documents: Readonly<Record<string, unknown>>[] = []
  for (const path of paths) {
    // Sequential on purpose: the order is the attachment order.
    const upload = await uploadRegistryFile(client, session, slot, path)
    documents.push(mapUploadToDocument(upload, documents.length, slot))
  }
  await saveRegistryRequest(
    client,
    session,
    buildRegistryBody(session, slot, { ...draft, documents }, 'draft'),
  )
  const full = {
    ...draft,
    documents,
    notificationEmail: content.notificationEmail,
  }
  await saveRegistryRequest(
    client,
    session,
    buildRegistryBody(session, slot, full, 'sign'),
  )
  await signRegistryForm(client, session, identity)
  const answer = await saveRegistryRequest(
    client,
    session,
    buildRegistryBody(session, slot, full, ''),
  )
  return mapRegistryAnswer(session.reference, answer)
}
