import type { XmlElement } from '../../xml/types/XmlElement'
import type { SignatureContext } from '../types/SignatureContext'
import { buildDataObjectFormat } from './buildDataObjectFormat'
import { buildElement } from './buildElement'
import { buildSignaturePolicyIdentifier } from './buildSignaturePolicyIdentifier'
import { buildSignerRole } from './buildSignerRole'
import { buildSigningCertificate } from './buildSigningCertificate'
import { buildTextElement } from './buildTextElement'

/**
 * xades:SignedProperties: SigningTime (UTC), SigningCertificate, the policy
 * when EPES, the SignerRole when roles are claimed, and a DataObjectFormat for
 * the signed content.
 */
export const buildSignedProperties = (
  context: SignatureContext,
): XmlElement => {
  const { xades } = context.prefixes
  const policy =
    context.policy === undefined
      ? []
      : [buildSignaturePolicyIdentifier(context.prefixes, context.policy)]
  const role =
    context.signerRoles.length === 0
      ? []
      : [buildSignerRole(xades, context.signerRoles)]
  const signingTime = context.signingTime
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
  return buildElement(
    `${xades}:SignedProperties`,
    { Id: context.ids.signedProperties },
    [
      buildElement(`${xades}:SignedSignatureProperties`, {}, [
        buildTextElement(`${xades}:SigningTime`, signingTime),
        buildSigningCertificate(context),
        ...policy,
        ...role,
      ]),
      buildElement(`${xades}:SignedDataObjectProperties`, {}, [
        buildDataObjectFormat(context),
      ]),
    ],
  )
}
