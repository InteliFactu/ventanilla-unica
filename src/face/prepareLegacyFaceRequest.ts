import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import type { LegacyFaceDelivery } from './LegacyFaceDelivery'
import type { LegacyFaceRequest } from './LegacyFaceRequest'
import { prepareFaceInvoice } from './prepareFaceInvoice'
import { signLegacyFaceSoap } from './signLegacyFaceSoap'
import { assertLegacyFaceDelivery } from './validators/assertLegacyFaceDelivery'

/** Build the signed invoice and its archived WS-Security request bytes offline. */
export const prepareLegacyFaceRequest = (
  identity: CertificateIdentity,
  invoice: Buffer,
  delivery: LegacyFaceDelivery,
): LegacyFaceRequest => {
  assertLegacyFaceDelivery(delivery)
  const { xml } = prepareFaceInvoice(identity, invoice)
  return { invoice: xml, soap: signLegacyFaceSoap(identity, xml, delivery) }
}
