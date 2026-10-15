import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { signPdf } from '../pades/signPdf'
import { signPdfTimestamped } from '../pades/signPdfTimestamped'
import type { DigestName } from '../types/DigestName'
import { padesOptionsOf } from './mappers/padesOptionsOf'
import { timestampAuthorityOf } from './mappers/timestampAuthorityOf'
import type { AutoScriptSigning } from './types/AutoScriptSigning'

/** An AutoScript PAdES signature, as the signed PDF, with AutoFirma's parameters; PAdES-B-T when `tsaURL` names a TSA. */
export const signAutoScriptPades = async (
  identity: CertificateIdentity,
  signing: AutoScriptSigning,
  digest: DigestName,
): Promise<Buffer> => {
  const options = padesOptionsOf(signing.params, digest)
  const timestamp = timestampAuthorityOf(signing.params)
  return timestamp === undefined
    ? signPdf(identity, signing.data, options)
    : signPdfTimestamped(
        identity,
        signing.data,
        { ...options, timestamp },
        signing.post,
      )
}
