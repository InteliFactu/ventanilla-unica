import type { XmlElement } from '../../xml/types/XmlElement'
import type { SignaturePolicy } from '../types/SignaturePolicy'
import type { XadesPrefixes } from '../types/XadesPrefixes'
import { buildDigestElements } from './buildDigestElements'
import { buildElement } from './buildElement'
import { buildText } from './buildText'
import { buildTextElement } from './buildTextElement'

/**
 * xades:SignaturePolicyIdentifier naming an explicit policy (with an empty
 * Description when it has none, as AutoFirma writes it), its hash and, when
 * given, the SPURI where it is published (XAdES-EPES).
 */
export const buildSignaturePolicyIdentifier = (
  prefixes: XadesPrefixes,
  policy: SignaturePolicy,
): XmlElement => {
  const { ds, xades } = prefixes
  const description =
    policy.description === undefined
      ? buildElement(`${xades}:Description`, {})
      : buildTextElement(`${xades}:Description`, policy.description)
  const qualifiers =
    policy.qualifier === undefined
      ? []
      : [
          buildElement(`${xades}:SigPolicyQualifiers`, {}, [
            buildElement(`${xades}:SigPolicyQualifier`, {}, [
              buildTextElement(`${xades}:SPURI`, policy.qualifier),
            ]),
          ]),
        ]
  return buildElement(`${xades}:SignaturePolicyIdentifier`, {}, [
    buildElement(`${xades}:SignaturePolicyId`, {}, [
      buildElement(`${xades}:SigPolicyId`, {}, [
        buildTextElement(`${xades}:Identifier`, policy.identifier),
        description,
      ]),
      buildElement(
        `${xades}:SigPolicyHash`,
        {},
        buildDigestElements(
          ds,
          policy.digestAlgorithm,
          buildText(policy.digestValue),
        ),
      ),
      ...qualifiers,
    ]),
  ])
}
