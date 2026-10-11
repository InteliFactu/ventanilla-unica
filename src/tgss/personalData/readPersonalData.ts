import type { HttpClient } from '../../http/types/HttpClient'
import { importassUrls } from '../session/importassUrls'
import { loginToImportass } from '../session/loginToImportass'
import { parsePersonalDataPage } from './parsers/parsePersonalDataPage'
import type { PersonalDataPage } from './types/PersonalDataPage'

/**
 * Log in to Importass and read "Tus datos personales": name, birth date,
 * identifier, NAF, phones, e-mail and domicile. Opening the page changes
 * nothing; the edit forms stay unsubmitted.
 */
export const readPersonalData = async (
  client: HttpClient,
): Promise<PersonalDataPage> => {
  await loginToImportass(client)
  const page = await client.request(importassUrls.personalData)
  return parsePersonalDataPage(page.text, page.url)
}
