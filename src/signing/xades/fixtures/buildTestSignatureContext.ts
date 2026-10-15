import { buildTestIdentity } from '../../fixtures/buildTestIdentity'
import { parseCertificateChain } from '../parsers/parseCertificateChain'
import type { SignatureContext } from '../types/SignatureContext'

/** A resolved signature context over a synthetic certificate, with fixed ids and time. */
export const buildTestSignatureContext = (
  overrides: Partial<SignatureContext> = {},
): SignatureContext => ({
  certificates: parseCertificateChain(buildTestIdentity().cert),
  prefixes: { ds: 'ds', xades: 'xades' },
  ids: {
    signature: 'S',
    signedInfo: 'S-SignedInfo',
    signatureValue: 'S-SignatureValue',
    keyInfo: 'S-KeyInfo',
    signedProperties: 'S-SignedProperties',
    qualifyingProperties: 'S-QualifyingProperties',
    reference: 'R',
    object: 'S-Object',
  },
  keyInfo: { chain: true, keyValue: false, reference: true },
  signingCertificateVersion: 1,
  policy: undefined,
  signingTime: new Date('2026-09-26T10:00:00.123Z'),
  signatureDigest: 'sha256',
  referencesDigest: 'sha256',
  signerRoles: [],
  contentC14nTransform: true,
  objectIdentifier: undefined,
  mimeType: 'text/xml',
  encoding: undefined,
  ...overrides,
})
