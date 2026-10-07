import type { HttpClient } from '../../http/types/HttpClient'
import { fetchJustificante } from '../fetchers/fetchJustificante'
import { postSignedApplication } from '../fetchers/postSignedApplication'
import { readFilingAnswer } from '../parsers/readFilingAnswer'
import type { FiledApplicationResult } from '../types/FiledApplicationResult'
import type { FilingOutputTarget } from '../types/FilingOutputTarget'
import type { SignedApplication } from '../types/SignedApplication'
import type { SigningScreen } from '../types/SigningScreen'
import { writeFilingFiles } from './writeFilingFiles'

/**
 * Post the signed application once, then keep the answer page, the signed
 * document and the justificante electrónico (a ZIP of the registry's signed
 * proof) as `<stem>.html`, `<stem>-firmada.xml` and `<stem>.zip`. Never posts twice:
 * whatever the portal answers is returned and saved.
 */
export const fileSignedApplication = async (
  client: HttpClient,
  screen: SigningScreen,
  signed: SignedApplication,
  output: FilingOutputTarget,
): Promise<FiledApplicationResult> => {
  const answer = await postSignedApplication(client, screen, signed)
  const read = readFilingAnswer(answer)
  const justificante = read.filed
    ? await fetchJustificante(client, answer).catch(() => undefined)
    : undefined
  const files = await writeFilingFiles(output.outDir, output.stem, {
    '.html': answer.body,
    '-firmada.xml': signed.xml,
    '.zip': justificante,
  })
  return {
    receipt: { ...read, files: files.written },
    notes: [
      ...(read.filed
        ? []
        : [
            'The signed post did not answer an acuse de recibo; read the saved page. Do NOT file again before checking rolece estado.',
          ]),
      ...(read.filed && justificante === undefined
        ? [
            'The justificante electrónico (ZIP) could not be downloaded automatically; the acuse de recibo page is saved and its descargarJustificante form can be posted again.',
          ]
        : []),
      ...files.failed.map((failure) => `Not saved: ${failure}`),
    ],
  }
}
