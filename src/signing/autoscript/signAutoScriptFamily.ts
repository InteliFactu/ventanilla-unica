import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { DigestName } from '../types/DigestName'
import { timestampXadesSignature } from '../xades/timestampXadesSignature'
import { timestampAuthorityOf } from './mappers/timestampAuthorityOf'
import { xadesOptionsOf } from './mappers/xadesOptionsOf'
import { signAutoScriptCades } from './signAutoScriptCades'
import { signAutoScriptFacturae } from './signAutoScriptFacturae'
import { signAutoScriptPades } from './signAutoScriptPades'
import { signAutoScriptXades } from './signAutoScriptXades'
import type { AutoScriptFamily } from './types/AutoScriptFamily'
import type { AutoScriptSigning } from './types/AutoScriptSigning'

/** Sign with the signer of an AutoScript format family other than `none`; `tsaURL` adds a signature timestamp (-T). */
export const signAutoScriptFamily = async (
  identity: CertificateIdentity,
  family: Exclude<AutoScriptFamily, 'none'>,
  signing: AutoScriptSigning,
  digest: DigestName,
): Promise<Buffer> => {
  const { data, format, params } = signing
  if (family === 'cades') return signAutoScriptCades(identity, signing, digest)
  if (family === 'pades') return signAutoScriptPades(identity, signing, digest)
  const xml =
    family === 'facturae'
      ? signAutoScriptFacturae(identity, data, params, digest)
      : signAutoScriptXades(
          identity,
          data,
          params,
          xadesOptionsOf(format, params, digest),
        )
  const authority = timestampAuthorityOf(params)
  return authority === undefined
    ? xml
    : timestampXadesSignature(xml, authority, signing.post)
}
