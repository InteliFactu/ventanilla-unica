import type { HttpClient } from '../../http/types/HttpClient'
import { staOrigins } from '../session/staOrigins'
import type { StaPortal } from '../types/StaPortal'
import { fetchRegistryReceiptPdf } from './fetchers/fetchRegistryReceiptPdf'
import { writeRegistryReceiptPdf } from './writeRegistryReceiptPdf'

/** Save the justificante of an existing registry entry, by its CSV and the filer's NIF, as `justificante-<registry number>.pdf`. */
export const downloadStaRegistryReceipt = async (
  client: HttpClient,
  portal: StaPortal,
  entry: {
    readonly csv: string
    readonly nif: string
    readonly registryNumber: string
    readonly outDir: string
  },
): Promise<{ readonly csv: string; readonly justificante: string }> => {
  const pdf = await fetchRegistryReceiptPdf(client, staOrigins[portal], entry)
  return {
    csv: entry.csv,
    justificante: await writeRegistryReceiptPdf(
      entry.outDir,
      entry.registryNumber,
      pdf,
    ),
  }
}
