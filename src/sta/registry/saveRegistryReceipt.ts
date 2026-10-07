import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRegistryReceiptPdf } from './fetchers/fetchRegistryReceiptPdf'
import type { RegistryReceiptTarget } from './types/RegistryReceiptTarget'
import type { StaRegistryReceipt } from './types/StaRegistryReceipt'
import { writeRegistryReceiptPdf } from './writeRegistryReceiptPdf'

/** Download the justificante of a registered entry and save it under `outDir`; the receipt gains its path. */
export const saveRegistryReceipt = async (
  client: HttpClient,
  origin: string,
  receipt: StaRegistryReceipt,
  target: RegistryReceiptTarget,
): Promise<StaRegistryReceipt> => {
  const pdf = await fetchRegistryReceiptPdf(client, origin, {
    csv: receipt.csv,
    nif: target.nif,
  })
  const justificante = await writeRegistryReceiptPdf(
    target.outDir,
    receipt.registryNumber,
    pdf,
  )
  return { ...receipt, justificante }
}
