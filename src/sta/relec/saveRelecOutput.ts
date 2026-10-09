import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRegistryReceiptPdf } from '../registry/fetchers/fetchRegistryReceiptPdf'
import { writeRegistryReceiptPdf } from '../registry/writeRegistryReceiptPdf'
import type { RelecReceipt } from './types/RelecReceipt'
import type { RelecSaveTarget } from './types/RelecSaveTarget'

/**
 * Save the justificante (`DocumentCheck` with the CSV and the NIF the result
 * page pairs with it) as `justificante-<registry number or CSV>.pdf`, and the
 * receipt with its plan as `aportacion-<CSV>.json`, under `outDir`.
 */
export const saveRelecOutput = async (
  client: HttpClient,
  origin: string,
  receipt: RelecReceipt,
  context: RelecSaveTarget,
): Promise<RelecReceipt> => {
  const pdf = await fetchRegistryReceiptPdf(client, origin, receipt)
  const justificante = await writeRegistryReceiptPdf(
    context.outDir,
    receipt.registryNumber ?? receipt.csv,
    pdf,
  )
  const output = join(context.outDir, `aportacion-${receipt.csv}.json`)
  const saved = { ...receipt, justificante, output }
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(
    output,
    `${JSON.stringify({ receipt: saved, filing: context.plan }, null, 2)}\n`,
  )
  return saved
}
