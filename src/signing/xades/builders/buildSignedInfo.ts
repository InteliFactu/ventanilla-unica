import { selectSigningKeyType } from '../../selectors/selectSigningKeyType'
import { digestUris } from '../digestUris'
import { ecdsaSignatureUris } from '../ecdsaSignatureUris'
import { rsaSignatureUris } from '../rsaSignatureUris'
import type { BuiltSignedInfo } from '../types/BuiltSignedInfo'
import type { ReferenceSpec } from '../types/ReferenceSpec'
import type { SignatureContext } from '../types/SignatureContext'
import { xadesUris } from '../xadesUris'
import { buildElement } from './buildElement'
import { buildReference } from './buildReference'

/**
 * ds:SignedInfo with inclusive C14N, RSA or ECDSA with the signature digest, and the
 * references: the
 * content, the SignedProperties and, when asked, the KeyInfo.
 */
export const buildSignedInfo = (
  context: SignatureContext,
  content: ReferenceSpec,
): BuiltSignedInfo => {
  const { ds } = context.prefixes
  const { ids } = context
  const specs: ReferenceSpec[] = [
    content,
    {
      type: xadesUris.signedPropertiesType,
      uri: `#${ids.signedProperties}`,
      transforms: [],
      target: { kind: 'id', id: ids.signedProperties },
    },
    ...(context.keyInfo.reference
      ? [
          {
            uri: `#${ids.keyInfo}`,
            transforms: [],
            target: { kind: 'id', id: ids.keyInfo } as const,
          },
        ]
      : []),
  ]
  const built = specs.map((spec) =>
    buildReference(ds, spec, digestUris[context.referencesDigest]),
  )
  const element = buildElement(`${ds}:SignedInfo`, { Id: ids.signedInfo }, [
    buildElement(`${ds}:CanonicalizationMethod`, { Algorithm: xadesUris.c14n }),
    buildElement(`${ds}:SignatureMethod`, {
      Algorithm: (selectSigningKeyType(context.certificates.signer) === 'ec'
        ? ecdsaSignatureUris
        : rsaSignatureUris)[context.signatureDigest],
    }),
    ...built.map((reference) => reference.element),
  ])
  return { element, references: built.map((reference) => reference.pending) }
}
