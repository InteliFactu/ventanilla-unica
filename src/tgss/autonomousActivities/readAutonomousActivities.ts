import type { HttpClient } from '../../http/types/HttpClient'
import { writeProsaPdf } from '../prosa/writeProsaPdf'
import { importassUrls } from '../session/importassUrls'
import { loginToImportass } from '../session/loginToImportass'
import { readBaseHref } from '../session/parsers/readBaseHref'
import { readActivitiesDownloadPath } from './parsers/readActivitiesDownloadPath'
import type { AutonomousActivitiesResult } from './types/AutonomousActivitiesResult'

/**
 * Log in to Importass, open "Informe de actividades de trabajo autónomo" and
 * download the PDF it generates on entry: every activity the holder has
 * communicated, with the company and role each is tied to (the RD 504/2022
 * data). Opening the service changes nothing; with `outDir` the PDF is saved.
 */
export const readAutonomousActivities = async (
  client: HttpClient,
  outDir: string | undefined,
): Promise<AutonomousActivitiesResult> => {
  await loginToImportass(client)
  const page = await client.request(importassUrls.activitiesReport)
  const path = readActivitiesDownloadPath(page.text)
  if (!path)
    throw new Error('Importass: the activities report offers no download')
  const response = await client.request(
    new URL(path, readBaseHref(page.text, page.url)).toString(),
    { referer: page.url },
  )
  const pdfMagic = '%PDF'
  if (
    response.body.subarray(0, pdfMagic.length).toString('latin1') !== pdfMagic
  )
    throw new Error(
      `Importass: no PDF returned (status ${String(response.status)})`,
    )
  return {
    pdfPath: outDir
      ? await writeProsaPdf(outDir, 'actividades', 'autonomo', response.body)
      : undefined,
    bytes: response.body.length,
    notes: [
      'the portal generates the informe when the service opens; it changes nothing about the holder',
    ],
  }
}
