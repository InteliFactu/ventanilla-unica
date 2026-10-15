import type { HttpClient } from '../../http/types/HttpClient'
import { callRegApi } from './fetchers/callRegApi'
import { loginWithCertificate } from './loginWithCertificate'
import type { RegSession } from './types/RegSession'
import type { RegUser } from './types/RegUser'

/** Log in and read the holder (`auth/user`); refuses a session with no holder. */
export const openRegSession = async (
  client: HttpClient,
): Promise<RegSession> => {
  const { token } = await loginWithCertificate(client)
  const user = (await callRegApi(client, token, 'auth/user')) as RegUser
  if (!user.docNumber)
    throw new Error('REG: the API reports no logged-in holder')
  return {
    token,
    holder: {
      docType: user.docType,
      docNumber: user.docNumber,
      nameUser: user.nameUser,
      firstSurname: user.firstSurname,
      familyNameUser: user.familyNameUser,
      businessName: user.businessName,
    },
  }
}
