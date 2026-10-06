import type { HttpClient } from '../../../http/types/HttpClient'
import { postRegistryForm } from '../../documentFiling/fetchers/postRegistryForm'
import { bulkFilingUrls } from '../bulkFilingUrls'

/**
 * Act on behalf of another holder, as "Cambiar usuario representado" does:
 * the dialog POSTs (its page script turns the GET into a POST when acting as
 * representative) and redirects back to TGVI Online in that holder's name.
 * The AEAT checks the power or the representation itself.
 */
export const switchRepresentedHolder = async (
  client: HttpClient,
  nif: string,
  nombre: string,
): Promise<string> => {
  const page = await postRegistryForm(
    client,
    bulkFilingUrls.representation,
    {
      ref: '/wlpl/OVPT-NTGV/TGVIOnline',
      tipoIden: 'F',
      representacion: 'representante',
      nif,
      nombre,
    },
    bulkFilingUrls.page,
  )
  return page.html
}
