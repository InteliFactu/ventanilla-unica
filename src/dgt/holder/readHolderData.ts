import type { HttpClient } from '../../http/types/HttpClient'
import { dgtUrls } from '../session/dgtUrls'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchAtexHolder } from './fetchers/fetchAtexHolder'
import { readAtexHolder } from './parsers/readAtexHolder'
import { readDgtJson } from './parsers/readDgtJson'
import { readContact } from './readContact'
import type { DgtHolderData } from './types/DgtHolderData'

/**
 * Read what the DGT holds about the certificate holder: identity, the postal
 * address it notifies to (which the DGT takes from the INE padrón unless the
 * holder changed it) and the contact data. Changes nothing.
 */
export const readHolderData = async (
  client: HttpClient,
  nif: string,
): Promise<DgtHolderData> => {
  await loginWithCertificate(client, dgtUrls.subscriptionsPage)
  const holder = readAtexHolder(
    readDgtJson(await fetchAtexHolder(client, nif), 'holder data'),
  )
  const contacto = await readContact(client)
  return {
    ...holder,
    contacto,
  }
}
