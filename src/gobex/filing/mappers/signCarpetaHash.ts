import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { signAutoScript } from '../../../signing/autoscript/signAutoScript'
import type { AutoScriptResult } from '../../../signing/autoscript/types/AutoScriptResult'

/** Match MiniApplet.sign and scriptFirma.js from the live Carpeta signing page. */
export const signCarpetaHash = async (
  identity: CertificateIdentity,
  hash: string,
): Promise<AutoScriptResult> => {
  if (!/^[a-z0-9+/]{27}=$/i.test(hash))
    throw new Error('Junta: missing or invalid signing hash')
  return signAutoScript(identity, {
    data: hash,
    algorithm: 'SHA512withRSA',
    format: 'XAdES',
    extraParams:
      'format=XAdES Detached\npolicyIdentifier=urn:oid:2.16.724.1.3.1.1.2.1.9\npolicyIdentifierHash=G7roucf600+f03r/o0bAOQ6WAs0=\npolicyIdentifierHashAlgorithm=http://www.w3.org/2000/09/xmldsig#sha1\npolicyQualifier=https://sede.administracion.gob.es/politica_de_firma_anexo_1.pdf',
  })
}
