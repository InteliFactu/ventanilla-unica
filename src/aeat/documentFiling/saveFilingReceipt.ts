import type { HttpClient } from '../../http/types/HttpClient'
import { fetchFilingPdf } from '../filings/fetchers/fetchFilingPdf'
import { parseFilingReceipt } from './parsers/parseFilingReceipt'
import type { AeatPage } from './types/AeatPage'
import type { DocumentFilingReceipt } from './types/DocumentFilingReceipt'
import { writeFilingFile } from './writers/writeFilingFile'

/**
 * Read the receipt and, with outDir, keep the receipt page as answered and
 * the justificante its CSV resolves to. The page is kept whatever it says,
 * because its layout was first seen on a real filing.
 */
export const saveFilingReceipt = async (
  client: HttpClient,
  page: AeatPage,
  outDir: string | undefined,
): Promise<DocumentFilingReceipt> => {
  const receipt = parseFilingReceipt(page.html)
  if (outDir === undefined) return receipt
  const stem = `aeat-registro-${receipt.csv ?? 'sin-csv'}`
  const receiptPagePath = await writeFilingFile(
    outDir,
    `${stem}.html`,
    page.html,
  )
  const justificantePath =
    receipt.csv === undefined
      ? undefined
      : await writeFilingFile(
          outDir,
          `${stem}.pdf`,
          await fetchFilingPdf(client, receipt.csv),
        )
  return { ...receipt, receiptPagePath, justificantePath }
}
