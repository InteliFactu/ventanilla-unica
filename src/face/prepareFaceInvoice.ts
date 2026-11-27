import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import { facturaeProfile } from '../signing/xades/facturaeProfile'
import { signXml } from '../signing/xades/signXml'
import type { SignXmlResult } from '../signing/xades/types/SignXmlResult'
import { parseXmlDocument } from '../signing/xml/parsers/parseXmlDocument'
import { assertFacturae322 } from './validators/assertFacturae322'
import { assertRsaFaceIdentity } from './validators/assertRsaFaceIdentity'
import { assertUnsignedFacturae } from './validators/assertUnsignedFacturae'

/** Apply the Facturae signature policy to one local Facturae 3.2.2 invoice. */
export const prepareFaceInvoice = (
  identity: CertificateIdentity,
  invoice: Buffer,
): SignXmlResult => {
  const { root } = parseXmlDocument(invoice)
  assertFacturae322(root)
  assertUnsignedFacturae(root)
  assertRsaFaceIdentity(identity)
  return signXml(identity, invoice, { mode: 'enveloped', ...facturaeProfile })
}
