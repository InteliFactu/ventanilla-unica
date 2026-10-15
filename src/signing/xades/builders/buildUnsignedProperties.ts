import type { XmlElement } from '../../xml/types/XmlElement'
import { xadesUris } from '../xadesUris'
import { buildElement } from './buildElement'
import { buildTextElement } from './buildTextElement'

/**
 * xades:UnsignedProperties carrying one SignatureTimeStamp over the
 * SignatureValue, canonicalised with C14N, as AutoFirma writes it
 * (`XAdESTspUtil`, clienteafirma 0d7f3cf).
 */
export const buildUnsignedProperties = (
  xades: string,
  ds: string,
  token: Buffer,
): XmlElement =>
  buildElement(`${xades}:UnsignedProperties`, {}, [
    buildElement(`${xades}:UnsignedSignatureProperties`, {}, [
      buildElement(`${xades}:SignatureTimeStamp`, {}, [
        buildElement(`${ds}:CanonicalizationMethod`, {
          Algorithm: xadesUris.c14n,
        }),
        buildTextElement(
          `${xades}:EncapsulatedTimeStamp`,
          token.toString('base64'),
        ),
      ]),
    ]),
  ])
