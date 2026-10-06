import type { HttpClient } from '../../http/types/HttpClient'
import { writeFilingFile } from '../documentFiling/writers/writeFilingFile'
import { fetchFilingPdf } from '../filings/fetchers/fetchFilingPdf'
import type { BulkFilingReceipt } from './types/BulkFilingReceipt'

/** The receipt; with outDir also the justificante the CSV resolves to at the cotejo service. */
export const saveBulkJustificante = async (
  client: HttpClient,
  modelo: string,
  csv: string,
  outDir: string | undefined,
): Promise<BulkFilingReceipt> =>
  outDir === undefined
    ? { csv }
    : {
        csv,
        justificantePath: await writeFilingFile(
          outDir,
          `aeat-${modelo}-${csv}.pdf`,
          await fetchFilingPdf(client, csv),
        ),
      }
