import { isSpanishDate } from '../../dates/isSpanishDate'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchProsaDocument } from '../prosa/fetchers/fetchProsaDocument'
import { readXmlField } from '../prosa/parsers/readXmlField'
import { readXmlMessages } from '../prosa/parsers/readXmlMessages'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchGeneratedInforme } from './fetchers/fetchGeneratedInforme'
import { parsePreviewSecuencial } from './parsers/parsePreviewSecuencial'
import type { VidaLaboralQuery } from './types/VidaLaboralQuery'
import type { VidaLaboralResult } from './types/VidaLaboralResult'
import { writeVidaLaboralPdf } from './writeVidaLaboralPdf'

/**
 * Emit the "informe de vida laboral acotado" (service INAF0011) for the
 * certificate holder over a date range and download its PDF. The entry
 * screen already names the holder and their NAF; one POST with the dates
 * generates the informe, whose sequence number the response announces in a
 * PREVIEW.
 */
export const emitVidaLaboral = async (
  client: HttpClient,
  query: VidaLaboralQuery,
  outDir: string | undefined,
): Promise<VidaLaboralResult> => {
  const { desde, hasta } = query
  if (!isSpanishDate(desde) || !isSpanishDate(hasta))
    throw new Error('TGSS: --desde and --hasta must be dates as DD/MM/AAAA')
  const notes = [
    'the informe is emitted on request; it changes nothing about the holder',
  ]
  const session = await loginWithCertificate(client, 'INAF0011')
  const holder = readXmlField(session.xml, 'nombre')
  const naf = readXmlField(session.xml, 'NAF_Ciudadano')
  const payload = await fetchGeneratedInforme(client, session, query)
  const messages = readXmlMessages(payload.xml)
  const secuencial = parsePreviewSecuencial(payload.xml)
  if (secuencial === undefined)
    throw new Error(
      `TGSS: no informe in the response (${messages.join(' | ') || 'no message'})`,
    )
  const pdf = await fetchProsaDocument(
    client,
    session.sessionId,
    secuencial,
    'INFORME',
  )
  const pdfPath = outDir
    ? await writeVidaLaboralPdf(outDir, naf ?? holder ?? 'holder', pdf)
    : undefined
  return {
    holder,
    naf,
    desde,
    hasta,
    messages,
    secuencial,
    pdfPath,
    bytes: pdf.length,
    notes,
  }
}
