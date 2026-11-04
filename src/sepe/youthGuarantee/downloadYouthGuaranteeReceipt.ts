import type { HttpClient } from '../../http/types/HttpClient'
import { fetchYouthGuaranteeDocuments } from './fetchers/fetchYouthGuaranteeDocuments'
import type { YouthGuaranteeWriteResult } from './types/YouthGuaranteeWriteResult'

/** A download failure must never hide an already executed filing action. */
export const downloadYouthGuaranteeReceipt = async (
  client: HttpClient,
  result: YouthGuaranteeWriteResult,
  out?: string,
): Promise<YouthGuaranteeWriteResult> => {
  if (!out || !result.receipt) return result
  try {
    return {
      ...result,
      receipt: {
        ...result.receipt,
        documents: await fetchYouthGuaranteeDocuments(
          client,
          result.receipt.documents,
          out,
        ),
      },
    }
  } catch {
    return {
      ...result,
      notes: [
        ...result.notes,
        'PDF download failed after the inscription action; the receipt is preserved. Use READ with a fresh output directory to obtain documents without resubmitting.',
      ],
    }
  }
}
