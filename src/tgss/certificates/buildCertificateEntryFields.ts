import { certificateKinds } from './certificateKinds'
import type { CertificateKind } from './types/CertificateKind'
import type { EmitCertificateOptions } from './types/EmitCertificateOptions'
import { validateCertificateReferenceDate } from './validators/validateCertificateReferenceDate'

/** Validate the selected certificate and include only its active form fields. */
export const buildCertificateEntryFields = (
  kind: CertificateKind,
  options: EmitCertificateOptions,
): Readonly<Record<string, string>> => {
  const { dateField, contractingEntityField } = certificateKinds[kind]
  const { referenceDate, contractingEntityNif } = options
  const fields: Record<string, string> = {}
  if (dateField) {
    if (referenceDate === undefined)
      throw new Error(
        `TGSS: certificate "${kind}" needs a reference date (--fecha DD/MM/YYYY)`,
      )
    fields[dateField] = validateCertificateReferenceDate(referenceDate)
  } else if (referenceDate !== undefined) {
    throw new Error(`TGSS: certificate "${kind}" does not accept --fecha`)
  }
  if (contractingEntityField) {
    if (!contractingEntityNif)
      throw new Error(
        `TGSS: certificate "${kind}" needs the contracting entity NIF (--entidad)`,
      )
    fields[contractingEntityField] = contractingEntityNif
  }
  return fields
}
