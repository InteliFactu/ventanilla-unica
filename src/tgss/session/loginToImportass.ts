import type { HttpClient } from '../../http/types/HttpClient'
import { importassUrls } from './importassUrls'
import { loginToSeguridadSocialPortal } from './loginToSeguridadSocialPortal'

/** Log in to Importass with the client's certificate; see `loginToSeguridadSocialPortal`. */
export const loginToImportass = async (client: HttpClient): Promise<void> => {
  await loginToSeguridadSocialPortal(
    client,
    importassUrls.entry,
    importassUrls.host,
  )
}
