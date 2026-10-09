import { downloadOneNotification } from '../documents/downloadOneNotification'
import type { NotificationDownloadItem } from '../documents/types/NotificationDownloadItem'
import type { NotificationDownloadSession } from '../documents/types/NotificationDownloadSession'
import type { Sleep } from '../documents/types/Sleep'
import type { AppearanceOutcome } from './types/AppearanceOutcome'

/**
 * Save the act and acuse of a notification already accepted. A failure here
 * comes back as `downloadError` rather than thrown: the acceptance has been
 * made and its deadlines run, so it must never be reported as not accepted.
 */
export const downloadAcceptedNotification = async (
  session: NotificationDownloadSession,
  item: NotificationDownloadItem,
  outDir: string,
  sleep: Sleep,
): Promise<Pick<AppearanceOutcome, 'files' | 'downloadError'>> => {
  try {
    const downloaded = await downloadOneNotification(
      session,
      item,
      outDir,
      sleep,
    )
    return { files: downloaded.files }
  } catch (error) {
    return {
      downloadError: error instanceof Error ? error.message : String(error),
    }
  }
}
