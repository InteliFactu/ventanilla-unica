import type { HttpClient } from '../../http/types/HttpClient'
import { callDgsfpService } from '../fetchers/callDgsfpService'
import type { DgsfpHolder } from '../types/DgsfpHolder'
import type { DgsfpSession } from '../types/DgsfpSession'
import { dgsfpUrls } from './dgsfpUrls'
import { loginWithCertificate } from './loginWithCertificate'
import { readRequestDigest } from './readRequestDigest'

/**
 * Log in and read what every later call needs: the form page's digest and
 * the holder (`getCurrentUser`). Refuses when the relay did not land on the
 * form page as the certificate's holder: a session for anyone else must
 * never file anything.
 */
export const openDgsfpSession = async (
  client: HttpClient,
): Promise<DgsfpSession> => {
  const formPage = await loginWithCertificate(client)
  const digest = readRequestDigest(formPage.text)
  if (!formPage.url.startsWith(dgsfpUrls.formPage) || digest === undefined)
    throw new Error(
      `DGSFP: the login did not land on the complaint form (${String(formPage.status)} at ${formPage.url})`,
    )
  const holder = (await callDgsfpService(
    client,
    digest,
    'RestService.svc/getCurrentUser',
  )) as DgsfpHolder
  if (!holder.identificador)
    throw new Error('DGSFP: the sede reports no logged-in holder')
  return { digest, holder }
}
