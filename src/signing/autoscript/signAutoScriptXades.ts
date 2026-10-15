import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { signXml } from '../xades/signXml'
import type { SignXmlOptions } from '../xades/types/SignXmlOptions'
import type { ExtraParams } from './types/ExtraParams'

/**
 * An AutoScript XAdES signature, as the signed XML. XAdES "explicit" (a
 * signature over the SHA-1 of the data) is refused.
 */
export const signAutoScriptXades = (
  identity: CertificateIdentity,
  data: Buffer,
  params: ExtraParams,
  options: SignXmlOptions,
): Buffer => {
  if (params.get('mode') === 'explicit')
    throw new Error('XAdES explicit (hash) signatures are not supported')
  return signXml(identity, data, options).xml
}
