import type { SignXmlOptions } from './SignXmlOptions'

/** The knobs of a XAdES cosignature or countersignature: those of `signXml` but where the signature goes, which the existing one fixes. */
export type XadesMultisignOptions = Omit<
  SignXmlOptions,
  'mode' | 'detachedUri' | 'signedNodeId'
>
