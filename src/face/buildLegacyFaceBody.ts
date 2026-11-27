import { buildElement } from '../signing/xades/builders/buildElement'
import { buildTextElement } from '../signing/xades/builders/buildTextElement'
import type { XmlElement } from '../signing/xml/types/XmlElement'
import type { LegacyFaceDelivery } from './LegacyFaceDelivery'
import { legacyFaceUris } from './legacyFaceUris'

/** Wrap one signed invoice in the archived `facturasspp2` RPC-literal request. */
export const buildLegacyFaceBody = (
  id: string,
  invoice: Buffer,
  delivery: LegacyFaceDelivery,
): XmlElement =>
  buildElement('soap:Body', { 'wsu:Id': id }, [
    buildElement('face:enviarFactura', { 'xmlns:face': legacyFaceUris.face }, [
      buildElement('request', {}, [
        buildTextElement('correo', delivery.email),
        buildElement('factura', {}, [
          buildTextElement('factura', invoice.toString('base64')),
          buildTextElement('nombre', delivery.filename),
          buildTextElement('mime', 'text/xml'),
        ]),
      ]),
    ]),
  ])
