import type { SignaturePolicy } from './types/SignaturePolicy'
import { xadesUris } from './xadesUris'

/**
 * The AGE signature policy v1.9 AutoFirma applies on `expPolicy=FirmaAGE`
 * (`policy.properties`, clienteafirma 0d7f3cf), written as its own samples
 * write it: the URN without a Qualifier, and the SPURI.
 */
export const agePolicy: SignaturePolicy = {
  identifier: 'urn:oid:2.16.724.1.3.1.1.2.1.9',
  digestAlgorithm: xadesUris.sha1,
  digestValue: 'G7roucf600+f03r/o0bAOQ6WAs0=',
  qualifier: 'https://sede.administracion.gob.es/politica_de_firma_anexo_1.pdf',
}
