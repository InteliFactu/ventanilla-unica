import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { DigestName } from '../types/DigestName'
import { xadesOptionsOf } from './mappers/xadesOptionsOf'
import { signAutoScriptCades } from './signAutoScriptCades'
import { signAutoScriptFacturae } from './signAutoScriptFacturae'
import { signAutoScriptPades } from './signAutoScriptPades'
import { signAutoScriptXades } from './signAutoScriptXades'
import type { AutoScriptFamily } from './types/AutoScriptFamily'
import type { AutoScriptSigning } from './types/AutoScriptSigning'

/** Sign with the signer of an AutoScript format family other than `none`. */
export const signAutoScriptFamily = async (
  identity: CertificateIdentity,
  family: Exclude<AutoScriptFamily, 'none'>,
  signing: AutoScriptSigning,
  digest: DigestName,
): Promise<Buffer> => {
  const { data, format, params } = signing
  if (family === 'cades') return signAutoScriptCades(identity, signing, digest)
  if (family === 'pades') return signAutoScriptPades(identity, signing, digest)
  if (params.get('tsaURL'))
    throw new Error('XAdES timestamps (XAdES-T) are not supported')
  if (family === 'facturae')
    return signAutoScriptFacturae(identity, data, params, digest)
  return signAutoScriptXades(
    identity,
    data,
    params,
    xadesOptionsOf(format, params, digest),
  )
}
