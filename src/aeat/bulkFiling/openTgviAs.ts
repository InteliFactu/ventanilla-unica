import type { HttpClient } from '../../http/types/HttpClient'
import { switchAeatHolder } from '../session/switchAeatHolder'
import { fetchTgviPage } from './fetchers/fetchTgviPage'
import { parseActingNif } from './parsers/parseActingNif'
import type { BulkFile } from './types/BulkFile'

/** Open TGVI Online acting for the file's declarant, switching the represented holder when it differs. */
export const openTgviAs = async (
  client: HttpClient,
  file: BulkFile,
): Promise<void> => {
  const page = await fetchTgviPage(client, file.modelo, file.ejercicio)
  if (parseActingNif(page) === file.nif) return
  const switched = await switchAeatHolder(
    client,
    file.nif,
    file.nombre,
    '/wlpl/OVPT-NTGV/TGVIOnline',
  )
  const acting = parseActingNif(switched)
  if (acting !== file.nif)
    throw new Error(
      `TGVI: the session acts for ${acting ?? 'nobody'}, not for the declarant ${file.nif}; the certificate holder may lack a power for it`,
    )
}
