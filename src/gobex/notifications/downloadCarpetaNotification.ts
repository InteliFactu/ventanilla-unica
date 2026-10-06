import { safeFileStem } from '../../dehu/documents/mappers/safeFileStem'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchCarpetaPdf } from './fetchers/fetchCarpetaPdf'
import { openCarpetaNotification } from './fetchers/openCarpetaNotification'
import type { CarpetaNotificationFiles } from './types/CarpetaNotificationFiles'
import type { LocatedCarpetaNotification } from './types/LocatedCarpetaNotification'
import { isPendingNotification } from './validators/isPendingNotification'
import { writeCarpetaPdf } from './writers/writeCarpetaPdf'

/**
 * Open an already accepted notification and save its PDF as `<id>.pdf`, plus
 * `<id>-acuse.pdf` when the sede serves the acuse as a PDF. A pending one is
 * refused before anything is posted: on it the link leads to acceptance.
 */
export const downloadCarpetaNotification = async (
  client: HttpClient,
  located: LocatedCarpetaNotification,
  outDir: string,
): Promise<CarpetaNotificationFiles> => {
  const id = located.record['notification'] ?? ''
  if (isPendingNotification(located.record))
    throw new Error(
      `Junta: notification ${id} is still Pendiente and opening it is accepting it: use junta carpeta-comparecer`,
    )
  const page = await openCarpetaNotification(client, located)
  const pdf = await fetchCarpetaPdf(client, page, 'imprimirnot')
  if (!pdf)
    throw new Error(`Junta: the sede gave no PDF for notification ${id}`)
  const stem = safeFileStem(id)
  const notification = await writeCarpetaPdf(outDir, `${stem}.pdf`, pdf)
  const acusePdf = await fetchCarpetaPdf(client, page, 'imprimiracuse')
  const acuse = acusePdf
    ? await writeCarpetaPdf(outDir, `${stem}-acuse.pdf`, acusePdf)
    : null
  return { notification, acuse }
}
