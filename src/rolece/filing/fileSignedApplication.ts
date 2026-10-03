import type { HttpClient } from '../../http/types/HttpClient'
import { fetchJustificante } from '../fetchers/fetchJustificante'
import { postSignedApplication } from '../fetchers/postSignedApplication'
import { readFilingAnswer } from '../parsers/readFilingAnswer'
import type { RegistrationReceipt } from '../types/RegistrationReceipt'
import type { SignedApplication } from '../types/SignedApplication'
import type { SigningScreen } from '../types/SigningScreen'
import { writeFilingFiles } from './writeFilingFiles'

/**
 * Post the signed application once, then keep the answer page, the signed
 * document and, when the acuse de recibo offers it, the justificante PDF as
 * `<stem>.html`, `<stem>-firmada.xml` and `<stem>.pdf`. Never posts twice:
 * whatever the portal answers is returned and saved.
 */
export const fileSignedApplication = async (
  client: HttpClient,
  screen: SigningScreen,
  signed: SignedApplication,
  output: { readonly outDir: string; readonly stem: string },
): Promise<{
  readonly receipt: RegistrationReceipt
  readonly notes: string[]
}> => {
  const answer = await postSignedApplication(client, screen, signed)
  const read = readFilingAnswer(answer)
  const pdf = read.filed
    ? await fetchJustificante(client, answer).catch(() => undefined)
    : undefined
  const files = await writeFilingFiles(output.outDir, output.stem, {
    '.html': answer.body,
    '-firmada.xml': signed.xml,
    '.pdf': pdf,
  })
  return {
    receipt: { ...read, files: files.written },
    notes: [
      ...(read.filed
        ? []
        : [
            'The signed post did not answer an acuse de recibo; read the saved page. Do NOT file again before checking rolece estado.',
          ]),
      ...(read.filed && pdf === undefined
        ? [
            'The justificante PDF could not be downloaded automatically; the acuse de recibo page is saved.',
          ]
        : []),
      ...files.failed.map((failure) => `Not saved: ${failure}`),
    ],
  }
}
