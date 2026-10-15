import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { signPdfStamped } from '../pades/signPdfStamped'
import type { DigestName } from '../types/DigestName'
import { padesOptionsOf } from './mappers/padesOptionsOf'
import { padesTimestampsOf } from './mappers/padesTimestampsOf'
import type { AutoScriptSigning } from './types/AutoScriptSigning'

/**
 * An AutoScript PAdES signature, as the signed PDF, with AutoFirma's
 * parameters; `tsaURL` with `tsType` 1, 2 or 3 stamps the signature, the
 * document before it, or both.
 */
export const signAutoScriptPades = async (
  identity: CertificateIdentity,
  signing: AutoScriptSigning,
  digest: DigestName,
): Promise<Buffer> =>
  signPdfStamped(
    identity,
    signing.data,
    {
      ...padesOptionsOf(signing.params, digest),
      ...padesTimestampsOf(signing.params),
    },
    signing.post,
  )
