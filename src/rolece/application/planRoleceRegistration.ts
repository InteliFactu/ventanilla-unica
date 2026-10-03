import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import type { SubmittedDocument } from '../../tgss/attachments/types/SubmittedDocument'
import type { WriteResult } from '../../write/types/WriteResult'
import { readSupportingPdf } from '../fetchers/readSupportingPdf'
import { fileSignedApplication } from '../filing/fileSignedApplication'
import { mapRegistrationPlan } from '../mappers/mapRegistrationPlan'
import { openRoleceSession } from '../session/openRoleceSession'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import type { RegistrationReceipt } from '../types/RegistrationReceipt'
import { prepareSignedApplication } from './prepareSignedApplication'

/**
 * File the initial ROLECE inscription of a Spanish sociedad mercantil (the
 * Solicitud Simplificada). Both modes log in, walk to the unsigned draft and
 * sign it locally; the plan prints the draft, the signature and the post.
 * Only with confirmation is the signed draft posted, once, and the acuse de
 * recibo saved under `--out`.
 */
export const planRoleceRegistration = async (
  client: HttpClient,
  query: RegistrationQuery,
  confirmed: boolean,
  identity: CertificateIdentity | undefined,
): Promise<WriteResult<RegistrationReceipt>> => {
  if (!identity) throw new Error('rolece solicitud needs the certificate')
  if (confirmed && !query.outDir)
    throw new Error(
      '--out is required with --confirmar si (the acuse de recibo is saved there)',
    )
  const documents: SubmittedDocument[] = []
  if (query.escritura)
    documents.push(await readSupportingPdf('escritura', query.escritura))
  if (query.poderes)
    documents.push(await readSupportingPdf('poderes', query.poderes))
  await openRoleceSession(client)
  const prepared = await prepareSignedApplication(client, identity, query)
  const plan = mapRegistrationPlan(prepared, documents)
  if (!confirmed || !query.outDir)
    return {
      action: 'rolece solicitud',
      executed: false,
      plan,
      notes: [
        'Nothing filed: "Firmar y Enviar Solicitud" only answers the unsigned draft, and the signature was computed locally and discarded.',
        'Filing is a legal act signed as the company representative; it needs --confirmar si and --out.',
      ],
    }
  const stem = `rolece-solicitud-${query.nif}-${new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' })}`
  const filed = await fileSignedApplication(
    client,
    prepared.screen,
    prepared.signed,
    {
      outDir: query.outDir,
      stem,
    },
  )
  return {
    action: 'rolece solicitud',
    executed: true,
    plan,
    receipt: filed.receipt,
    notes: filed.notes,
  }
}
