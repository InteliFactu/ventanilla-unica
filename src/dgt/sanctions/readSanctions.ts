import { writeNamedPdf } from '../../dgsfp/writers/writeNamedPdf'
import type { HttpClient } from '../../http/types/HttpClient'
import { dgtUrls } from '../session/dgtUrls'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchSanctionPdf } from './fetchers/fetchSanctionPdf'
import { parseSanctionDetail } from './parsers/parseSanctionDetail'
import { parseSanctionRows } from './parsers/parseSanctionRows'
import type { DgtSanction } from './types/DgtSanction'

/**
 * The holder's fines in "Mis sanciones", each with its detail page and, with
 * `outDir`, its "Datos de Expediente" PDF saved as `<expediente>.pdf`. The
 * sede lists finished fines for six months. Changes nothing.
 */
export const readSanctions = async (
  client: HttpClient,
  outDir?: string,
): Promise<readonly DgtSanction[]> => {
  const page = await loginWithCertificate(client, dgtUrls.sanctionsPage)
  if (!page.text.includes('id="datatable_sanciones"'))
    throw new Error(
      `DGT: ${page.url} carried no sanctions table; the page changed or the session is not Mi DGT`,
    )
  const sanctions: DgtSanction[] = []
  for (const row of parseSanctionRows(page.text)) {
    const detail = await client.request(
      `${dgtUrls.sanctionDetail}?numExpediente=${encodeURIComponent(row.expediente)}&a=`,
      { referer: dgtUrls.sanctionsPage },
    )
    const path =
      outDir === undefined
        ? undefined
        : await writeNamedPdf(
            outDir,
            undefined,
            `${row.expediente}.pdf`,
            await fetchSanctionPdf(client, row.expediente),
          )
    sanctions.push({ ...row, detalle: parseSanctionDetail(detail.text), path })
  }
  return sanctions
}
