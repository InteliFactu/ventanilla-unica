import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithClave } from '../session/loginWithClave'
import { prepareCarpetaProfile } from './prepareCarpetaProfile'
import { submitCarpetaApplication } from './submitCarpetaApplication'
import type { CarpetaFilingOptions } from './types/CarpetaFilingOptions'
import type { CarpetaProfileRequest } from './types/CarpetaProfileRequest'

/** Completing location codes and contacts is a filing, not a read or an automatic prerequisite. */
export const completeCarpetaProfile = async (
  client: HttpClient,
  identity: CertificateIdentity,
  request: CarpetaProfileRequest,
  options: CarpetaFilingOptions,
): Promise<unknown> => {
  if (!options.confirmed)
    return {
      executed: false,
      action:
        'Complete location codes and contact fields in the existing Carpeta profile',
      request,
    }
  await loginWithClave(client)
  const page = await prepareCarpetaProfile(client, request)
  return submitCarpetaApplication(client, identity, page, options.outDir)
}
