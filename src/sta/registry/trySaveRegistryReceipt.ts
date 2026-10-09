import type { HttpClient } from '../../http/types/HttpClient'
import { saveRegistryReceipt } from './saveRegistryReceipt'
import type { RequestedReceiptTarget } from './types/RequestedReceiptTarget'
import type { SavedRegistryReceipt } from './types/SavedRegistryReceipt'
import type { StaRegistryReceipt } from './types/StaRegistryReceipt'

/**
 * Save the justificante of an entry that is already registered, when an
 * `outDir` was asked for. A failed
 * download is a note, never an error: the registry number and CSV must
 * still reach the holder, who can fetch the PDF later with the CSV.
 */
export const trySaveRegistryReceipt = async (
  client: HttpClient,
  origin: string,
  receipt: StaRegistryReceipt,
  target: RequestedReceiptTarget,
): Promise<SavedRegistryReceipt> => {
  const { nif, outDir } = target
  if (outDir === undefined) return { receipt, notes: [] }
  try {
    return {
      receipt: await saveRegistryReceipt(client, origin, receipt, {
        nif,
        outDir,
      }),
      notes: [],
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return {
      receipt,
      notes: [`Registered, but the justificante was not saved: ${reason}`],
    }
  }
}
