import { downloadNotificationFile } from './downloadNotificationFile'
import type { DownloadedDocument } from './types/DownloadedDocument'
import type { NotificationDownloadItem } from './types/NotificationDownloadItem'
import type { NotificationDownloadSession } from './types/NotificationDownloadSession'
import type { Sleep } from './types/Sleep'

/** The document, then the voucher, of one realized notification. */
export const downloadOneNotification = async (
  session: NotificationDownloadSession,
  item: NotificationDownloadItem,
  outDir: string,
  sleep: Sleep,
): Promise<DownloadedDocument> => {
  const base = { ...session, reference: item.reference }
  return {
    id: item.id,
    reference: item.reference,
    files: [
      await downloadNotificationFile(
        { ...base, kind: 'document' },
        item.id,
        outDir,
        sleep,
      ),
      await downloadNotificationFile(
        { ...base, kind: 'voucher' },
        item.id,
        outDir,
        sleep,
      ),
    ],
  }
}
