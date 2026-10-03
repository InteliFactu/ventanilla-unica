import type { HttpClient } from '../../http/types/HttpClient'
import type { SubmittedDocument } from '../../tgss/attachments/types/SubmittedDocument'
import type { WriteResult } from '../../write/types/WriteResult'
import { readSupportingPdf } from '../fetchers/readSupportingPdf'
import { mapRegistrationPlan } from '../mappers/mapRegistrationPlan'
import { openRoleceSession } from '../session/openRoleceSession'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import type { RegistrationReceipt } from '../types/RegistrationReceipt'
import { readSimplifiedApplication } from './readSimplifiedApplication'

/**
 * Plan the initial ROLECE inscription of a Spanish sociedad mercantil (the
 * Solicitud Simplificada). Without confirmation it logs in, walks the two
 * screens that only check and choose, and prints the body of "Firmar y Enviar
 * Solicitud". With confirmation it refuses before the first request: that
 * button leads to the signature of the application summary, which has not
 * been captured, and after it the application is filed.
 */
export const planRoleceRegistration = async (
  client: HttpClient,
  query: RegistrationQuery,
  confirmed: boolean,
): Promise<WriteResult<RegistrationReceipt>> => {
  const documents: SubmittedDocument[] = []
  if (query.escritura)
    documents.push(await readSupportingPdf('escritura', query.escritura))
  if (query.poderes)
    documents.push(await readSupportingPdf('poderes', query.poderes))
  if (confirmed)
    throw new Error(
      'rolece solicitud cannot file yet: the signature screen after "Firmar y Enviar Solicitud" has not been captured. Nothing was sent.',
    )
  await openRoleceSession(client)
  const application = await readSimplifiedApplication(client, query)
  return {
    action: 'rolece solicitud',
    executed: false,
    plan: mapRegistrationPlan(
      application.action,
      application.fields,
      documents,
    ),
    notes: [
      'Read-only so far: login, the inscription check (comprobarOEInscrito) and the comunidad choice. Neither files anything.',
      'Filing is a legal act signed as the company representative; it needs --confirmar si and a captured signing step.',
    ],
  }
}
