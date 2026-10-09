import type { HttpClient } from '../../http/types/HttpClient'
import { saveRelecOutput } from './saveRelecOutput'
import type { RelecOutputTarget } from './types/RelecOutputTarget'
import type { RelecReceipt } from './types/RelecReceipt'
import type { SavedRelecOutput } from './types/SavedRelecOutput'

/**
 * Save the justificante and the JSON when `--out` was given. A failure is a
 * note, never an error: the filing is already registered and its CSV must
 * still reach the holder.
 */
export const trySaveRelecOutput = async (
  client: HttpClient,
  origin: string,
  receipt: RelecReceipt,
  context: RelecOutputTarget,
): Promise<SavedRelecOutput> => {
  const { plan, outDir } = context
  if (outDir === undefined) return { receipt, notes: [] }
  try {
    return {
      receipt: await saveRelecOutput(client, origin, receipt, { plan, outDir }),
      notes: [],
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return {
      receipt,
      notes: [`Registered, but the output was not saved: ${reason}`],
    }
  }
}
