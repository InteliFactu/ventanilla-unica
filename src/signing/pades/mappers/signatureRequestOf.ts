import type { SignatureRequest } from '../types/SignatureRequest'
import type { SignPdfOptions } from '../types/SignPdfOptions'
import { stampLinesOf } from './stampLinesOf'

/** The signature request `signPdf` options describe, for the signer named `commonName`. */
export const signatureRequestOf = (
  commonName: string,
  options: SignPdfOptions,
): SignatureRequest => {
  if (
    options.policy !== undefined &&
    options.subFilter === 'adbe.pkcs7.detached'
  )
    throw new Error(
      'a signature policy needs the ETSI.CAdES.detached subfilter',
    )
  const details = {
    commonName,
    date: options.date ?? new Date(),
    reason: options.reason,
    location: options.location,
    contactInfo: options.contactInfo,
    subFilter: options.subFilter,
  }
  const visible =
    options.visible === true ||
    options.rect !== undefined ||
    options.text !== undefined
  return {
    ...details,
    stampLines: visible ? stampLinesOf(details, options.text) : undefined,
    page: options.page ?? 1,
    rect: options.rect ?? [36, 36, 336, 86],
    field: options.field,
  }
}
