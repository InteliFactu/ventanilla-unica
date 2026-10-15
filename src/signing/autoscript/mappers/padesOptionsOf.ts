import { parsePdfPage } from '../../pades/parsers/parsePdfPage'
import type { PdfSubFilter } from '../../pades/types/PdfSubFilter'
import type { SignPdfOptions } from '../../pades/types/SignPdfOptions'
import type { DigestName } from '../../types/DigestName'
import type { ExtraParams } from '../types/ExtraParams'
import { cmsPolicyOf } from './cmsPolicyOf'
import { padesRectOf } from './padesRectOf'

/**
 * The `signPdf` options an AutoScript PAdES call amounts to: `signReason`,
 * `signatureProductionCity`, `signerContact`, `signatureField`,
 * `signaturePage`, `signaturePositionOnPage*`, `layer2Text` and
 * `signatureSubFilter` (ETSI forced under a policy, as AutoFirma does).
 */
export const padesOptionsOf = (
  params: ExtraParams,
  digest: DigestName,
): SignPdfOptions => {
  const policy = cmsPolicyOf(params)
  const subFilter = params.get('signatureSubFilter')
  if (
    subFilter !== undefined &&
    subFilter !== 'ETSI.CAdES.detached' &&
    subFilter !== 'adbe.pkcs7.detached'
  )
    throw new Error(`unsupported signatureSubFilter: ${subFilter}`)
  const chosen: PdfSubFilter | undefined =
    policy === undefined ? subFilter : undefined
  return {
    digest,
    policy,
    subFilter: chosen,
    reason: params.get('signReason'),
    location: params.get('signatureProductionCity'),
    contactInfo: params.get('signerContact'),
    field: params.get('signatureField'),
    page: parsePdfPage(params.get('signaturePage')),
    rect: padesRectOf(params),
    text: params.get('layer2Text'),
  }
}
