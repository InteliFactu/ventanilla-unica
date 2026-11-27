import { randomUUID } from 'node:crypto'

import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import { buildFaceBody } from './buildFaceBody'
import type { FaceDelivery } from './FaceDelivery'
import type { LegacyFaceRequest } from './LegacyFaceRequest'
import { prepareFaceInvoice } from './prepareFaceInvoice'
import { signFaceSoap } from './signFaceSoap'
import { assertFaceDelivery } from './validators/assertFaceDelivery'

/** Build the signed invoice and its archived WS-Security request bytes offline. */
export const prepareLegacyFaceRequest = (
  identity: CertificateIdentity,
  invoice: Buffer,
  delivery: FaceDelivery,
): LegacyFaceRequest => {
  assertFaceDelivery(delivery)
  const { xml } = prepareFaceInvoice(identity, invoice)
  const body = buildFaceBody(`id-${randomUUID()}`, xml, delivery, 'legacy')
  return { invoice: xml, soap: signFaceSoap(identity, body, 'legacy') }
}
