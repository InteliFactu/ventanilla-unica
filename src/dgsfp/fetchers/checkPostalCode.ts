import type { HttpClient } from '../../http/types/HttpClient'
import { callDgsfpService } from './callDgsfpService'

/**
 * Run the address section's `DatosValidarCodigoPostal` validator as the page
 * does. The page passes the province key as `codigoPostal` and the postcode
 * as `codigoProvincia` (its `ValidarCodigoPostal(o.key, r)` against a
 * `(codigoPostal, codigoProvincia)` signature); the service expects exactly
 * that, and answers "no pertenece" to the names read literally.
 */
export const checkPostalCode = async (
  client: HttpClient,
  digest: string,
  place: { readonly provinceKey: string; readonly postalCode: string },
): Promise<void> => {
  const answer = (await callDgsfpService(
    client,
    digest,
    'CoreServices.svc/validarCodigoPostal',
    { codigoPostal: place.provinceKey, codigoProvincia: place.postalCode },
  )) as { readonly errores?: readonly string[] | null }
  const errors = answer.errores ?? []
  if (errors.length > 0) throw new Error(`DGSFP: ${errors.join('; ')}`)
}
