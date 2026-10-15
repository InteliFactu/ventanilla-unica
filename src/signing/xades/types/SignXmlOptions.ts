import type { DigestName } from '../../types/DigestName'
import type { KeyInfoOptions } from './KeyInfoOptions'
import type { SignaturePolicy } from './SignaturePolicy'
import type { SigningCertificateVersion } from './SigningCertificateVersion'
import type { XadesIds } from './XadesIds'
import type { XadesMode } from './XadesMode'
import type { XadesPrefixes } from './XadesPrefixes'

/** The knobs of an XML signature; everything but `mode` has a documented default. */
export type SignXmlOptions = {
  readonly mode: XadesMode
  /** XAdES-EPES policy; absent means XAdES-BES. */
  readonly policy?: SignaturePolicy | undefined
  /** Default 1. */
  readonly signingCertificateVersion?: SigningCertificateVersion | undefined
  /** Default `ds` and `xades`. */
  readonly prefixes?: Partial<XadesPrefixes> | undefined
  /** Default: all derived from one random `Signature-<uuid>`. */
  readonly ids?: Partial<XadesIds> | undefined
  /** Default: chain, no key value, KeyInfo referenced. */
  readonly keyInfo?: Partial<KeyInfoOptions> | undefined
  /** Digest of the RSA signature over SignedInfo; default SHA-256. */
  readonly signatureDigest?: DigestName | undefined
  /** Digest of every Reference and of the CertDigest; default SHA-256. */
  readonly referencesDigest?: DigestName | undefined
  /** Default: now. */
  readonly signingTime?: Date | undefined
  /** xades:SignerRole ClaimedRoles; default none. Facturae claims `emisor`. */
  readonly signerRoles?: readonly string[] | undefined
  /**
   * Enveloped only: follow the enveloped-signature transform with C14N.
   * Default true; Facturae signs with the enveloped transform alone.
   */
  readonly contentC14nTransform?: boolean | undefined
  /** DataObjectFormat ObjectIdentifier (OIDAsURN), e.g. `urn:oid:1.2.840.10003.5.109.10`; default none. */
  readonly objectIdentifier?: string | undefined
  /** DataObjectFormat MimeType; default `text/xml`, or `application/octet-stream` for non-XML. */
  readonly mimeType?: string | undefined
  /** Reference URI of detached content; required in detached mode. */
  readonly detachedUri?: string | undefined
  /**
   * Enveloped only, AutoFirma's `nodeToSign`: sign the element with this id
   * (`Id`, `ID` or `id`) by `URI="#id"` and put the signature inside it,
   * instead of `URI=""` over the whole document.
   */
  readonly signedNodeId?: string | undefined
}
