import type { CmsSignaturePolicy } from './types/CmsSignaturePolicy'

/**
 * The AGE signature policy v1.9 for CAdES and PAdES, as AutoFirma applies it
 * on `expPolicy=FirmaAGE` (`policy.properties`, clienteafirma 0d7f3cf).
 */
export const agePolicyCms: CmsSignaturePolicy = {
  oid: '2.16.724.1.3.1.1.2.1.9',
  digest: 'sha1',
  digestValue: 'G7roucf600+f03r/o0bAOQ6WAs0=',
  uri: 'https://sede.administracion.gob.es/politica_de_firma_anexo_1.pdf',
}
