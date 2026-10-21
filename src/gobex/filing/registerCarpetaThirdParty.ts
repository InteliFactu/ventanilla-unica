import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithClave } from '../session/loginWithClave'
import { prepareCarpetaThirdParty } from './prepareCarpetaThirdParty'
import { submitCarpetaApplication } from './submitCarpetaApplication'
import type { CarpetaFilingOptions } from './types/CarpetaFilingOptions'
import type { CarpetaThirdPartyRequest } from './types/CarpetaThirdPartyRequest'

/** Without explicit confirmation, never create a draft or authorize verification of a bank account. */
export const registerCarpetaThirdParty = async (
  client: HttpClient,
  identity: CertificateIdentity,
  request: CarpetaThirdPartyRequest,
  options: CarpetaFilingOptions,
): Promise<unknown> => {
  if (!options.confirmed)
    return {
      executed: false,
      action:
        'Register the holder and bank account for Junta payments; authorize AEAT identity and bank-ownership verification',
      accountEnding: request.iban.slice(-4),
    }
  await loginWithClave(client)
  const page = await prepareCarpetaThirdParty(
    client,
    request.iban,
    request.phone,
  )
  return submitCarpetaApplication(client, identity, page, options.outDir)
}
