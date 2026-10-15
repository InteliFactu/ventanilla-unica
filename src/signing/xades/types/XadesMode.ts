/**
 * Where the signature sits relative to what it signs. `detached` points at an
 * external file (AutoFirma's "Externally Detached"); `internally-detached` is
 * AutoFirma's "XAdES Detached": an `AFIRMA` root holding the content in a
 * `CONTENT` node and the signature as its sibling.
 */
export type XadesMode =
  'enveloped' | 'enveloping' | 'detached' | 'internally-detached'
