import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { DigestName } from '../types/DigestName'
import { xadesOptionsOf } from './mappers/xadesOptionsOf'
import { signAutoScriptCades } from './signAutoScriptCades'
import { signAutoScriptFacturae } from './signAutoScriptFacturae'
import { signAutoScriptPades } from './signAutoScriptPades'
import { signAutoScriptXades } from './signAutoScriptXades'
import type { AutoScriptFamily } from './types/AutoScriptFamily'
import type { AutoScriptSigning } from './types/AutoScriptSigning'

/** Sign `data` with the signer of an AutoScript format family other than `none`. */
export const signAutoScriptFamily = (
  identity: CertificateIdentity,
  family: Exclude<AutoScriptFamily, 'none'>,
  signing: AutoScriptSigning,
  digest: DigestName,
): Buffer => {
  const { data, format, params } = signing
  if (family === 'cades')
    return signAutoScriptCades(identity, data, params, digest)
  if (family === 'pades')
    return signAutoScriptPades(identity, data, params, digest)
  if (family === 'facturae')
    return signAutoScriptFacturae(identity, data, params, digest)
  return signAutoScriptXades(
    identity,
    data,
    params,
    xadesOptionsOf(format, params, digest),
  )
}
