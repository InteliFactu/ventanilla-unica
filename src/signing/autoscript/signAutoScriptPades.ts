import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { signPdf } from '../pades/signPdf'
import type { DigestName } from '../types/DigestName'
import { padesOptionsOf } from './mappers/padesOptionsOf'
import type { ExtraParams } from './types/ExtraParams'

/** An AutoScript PAdES signature, as the signed PDF, with AutoFirma's parameters. */
export const signAutoScriptPades = (
  identity: CertificateIdentity,
  data: Buffer,
  params: ExtraParams,
  digest: DigestName,
): Buffer => signPdf(identity, data, padesOptionsOf(params, digest))
