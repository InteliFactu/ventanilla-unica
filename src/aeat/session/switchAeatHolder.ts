import type { HttpClient } from '../../http/types/HttpClient'
import { postRegistryForm } from '../documentFiling/fetchers/postRegistryForm'
import { aeatBaseUrl } from './aeatBaseUrl'

/**
 * Act on behalf of another holder, as "Cambiar usuario representado" does:
 * the dialog POSTs (its page script turns the GET into a POST when acting as
 * representative) and redirects to `ref` in that holder's name. The AEAT
 * checks the power or the representation itself.
 */
export const switchAeatHolder = async (
  client: HttpClient,
  nif: string,
  nombre: string,
  ref: string,
): Promise<string> => {
  const page = await postRegistryForm(
    client,
    `${aeatBaseUrl}/wlpl/OVCT-CXEW/DialogoRepresentacion`,
    {
      ref,
      tipoIden: 'F',
      representacion: 'representante',
      nif,
      nombre,
    },
    `${aeatBaseUrl}${ref}`,
  )
  return page.html
}
