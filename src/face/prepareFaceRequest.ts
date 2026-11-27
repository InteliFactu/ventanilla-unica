import { randomUUID } from 'node:crypto'

import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import { buildFaceBody } from './buildFaceBody'
import type { FaceDelivery } from './FaceDelivery'
import type { FaceEnvironment } from './FaceEnvironment'
import type { FaceRequest } from './FaceRequest'
import { faceSoapUris } from './faceSoapUris'
import { prepareFaceInvoice } from './prepareFaceInvoice'
import { signFaceSoap } from './signFaceSoap'
import { assertFaceDelivery } from './validators/assertFaceDelivery'

/** Prepare the FACe supplier v1 invoice and its SOAP request offline. */
export const prepareFaceRequest = (
  identity: CertificateIdentity,
  invoice: Buffer,
  delivery: FaceDelivery,
  environment: FaceEnvironment = 'production',
): FaceRequest => {
  if (!Object.keys(faceSoapUris.supplier).includes(environment)) {
    throw new Error('FACe environment must be production or sandbox')
  }
  const namespace = faceSoapUris.supplier[environment]
  assertFaceDelivery(delivery)
  const { xml } = prepareFaceInvoice(identity, invoice)
  const body = buildFaceBody(`id-${randomUUID()}`, xml, delivery, namespace)
  return {
    invoice: xml,
    soap: signFaceSoap(identity, body, 'supplier-v1'),
    soapAction: `${namespace}#enviarFactura`,
  }
}
