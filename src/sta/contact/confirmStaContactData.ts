import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { openStaSession } from '../session/openStaSession'
import { staOrigins } from '../session/staOrigins'
import type { StaPortal } from '../types/StaPortal'
import { answerContactGate } from './answerContactGate'
import type { StaContactQuery } from './types/StaContactQuery'
import type { StaContactReceipt } from './types/StaContactReceipt'

/**
 * Answer an STA sede's contact-data gate (`CONFIRMACION_DATOS_PERSONALES`),
 * which a certificate that never logged in there meets before anything else.
 * Without confirmation it only logs in and says whether the gate is up; with
 * it the phone and e-mail are saved, the gate's confirming buttons pressed
 * ("SÍ", "Aceptar"; never "NO" or "Modificar") and the session must then open.
 */
export const confirmStaContactData = async (
  client: HttpClient,
  portal: StaPortal,
  query: StaContactQuery,
  confirmed: boolean,
): Promise<WriteResult<StaContactReceipt>> => {
  const origin = staOrigins[portal]
  const host = new URL(origin).hostname
  const action = `${portal} datos-contacto`
  const landing = await client.request(
    `${origin}/sta/CarpetaPrivate/Certificate?APP_CODE=STA&PAGE_CODE=HOME`,
  )
  if (!landing.url.includes('CONFIRMACION_DATOS_PERSONALES'))
    return {
      action,
      executed: false,
      plan: [`${host} asks for no contact data: nothing to confirm`],
      notes: [],
    }
  const plan = [
    `Save contact data at ${host}: e-mail ${query.email}${query.phone ? `, phone ${query.phone}` : ''}`,
    'Then answer the gate: contact data correct, identification data accepted',
  ]
  if (!confirmed)
    return {
      action,
      executed: false,
      plan,
      notes: ['Only the login ran; --confirmar si saves the contact data.'],
    }
  const steps = await answerContactGate(
    client,
    { url: landing.url, html: landing.text },
    query,
  )
  await openStaSession(client, origin)
  return {
    action,
    executed: true,
    plan,
    receipt: { steps, sessionOpens: true },
    notes: [],
  }
}
