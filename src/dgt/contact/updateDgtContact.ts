import type { HttpClient } from '../../http/types/HttpClient'
import { fetchAtexHolder } from '../holder/fetchers/fetchAtexHolder'
import { readAtexHolder } from '../holder/parsers/readAtexHolder'
import { readDgtJson } from '../holder/parsers/readDgtJson'
import { readContact } from '../holder/readContact'
import { dgtUrls } from '../session/dgtUrls'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { buildSubscriptionFields } from './builders/buildSubscriptionFields'
import { submitSubscription } from './fetchers/submitSubscription'
import type { DgtContactContext } from './types/DgtContactContext'
import type { DgtContactQuery } from './types/DgtContactQuery'
import type { DgtContactUpdate } from './types/DgtContactUpdate'

/**
 * Register or change the holder's email and phone at the DGT ("Mis datos de
 * contacto y suscripciones"). Legal effect: the DGT uses them for its
 * communications and avisos (never for sanctions or notifications, which go
 * to the DEV and the postal address); the postal address is not touched.
 * Without `confirmed` it logs in, checks the holder and returns the plan.
 */
export const updateDgtContact = async (
  client: HttpClient,
  query: DgtContactQuery,
  context: DgtContactContext,
): Promise<DgtContactUpdate> => {
  await loginWithCertificate(client, dgtUrls.subscriptionsPage)
  const holder = readAtexHolder(
    readDgtJson(await fetchAtexHolder(client, query.nif), 'holder data'),
  )
  if (holder.nif.toUpperCase() !== query.nif)
    throw new Error(
      `DGT: the session belongs to ${holder.nif}, not to ${query.nif}`,
    )
  const fields = buildSubscriptionFields(query)
  const plan = {
    ...query,
    titular: holder.nombre,
    antes: await readContact(client),
    request: { url: dgtUrls.subscriptionsPage, fields },
  }
  if (!context.confirmed) return { ...plan, submitted: false }
  await submitSubscription(client, fields)
  const despues = await readContact(client)
  if (despues?.email !== query.email || despues.telefono !== query.telefono)
    throw new Error(
      `DGT: the contact data read back (${JSON.stringify(despues)}) is not what was sent`,
    )
  return { ...plan, submitted: true, despues }
}
