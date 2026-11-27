import { buildElement } from '../signing/xades/builders/buildElement'
import { buildTextElement } from '../signing/xades/builders/buildTextElement'
import type { XmlElement } from '../signing/xml/types/XmlElement'
import type { FaceDelivery } from './FaceDelivery'
import type { FaceSoapProfile } from './FaceSoapProfile'
import { faceSoapUris } from './faceSoapUris'

/** Wrap one signed invoice using the service's RPC-literal invoice fields. */
export const buildFaceBody = (
  id: string,
  invoice: Buffer,
  delivery: FaceDelivery,
  profile: FaceSoapProfile,
): XmlElement => {
  const legacy = profile === 'legacy'
  const namespace = legacy ? faceSoapUris.legacy : faceSoapUris.supplier
  return buildElement('soap:Body', { 'wsu:Id': id }, [
    buildElement('face:enviarFactura', { 'xmlns:face': namespace }, [
      buildElement('request', {}, [
        buildTextElement('correo', delivery.email),
        buildElement('factura', {}, [
          buildTextElement('factura', invoice.toString('base64')),
          buildTextElement('nombre', delivery.filename),
          ...(legacy ? [buildTextElement('mime', 'text/xml')] : []),
        ]),
      ]),
    ]),
  ])
}
