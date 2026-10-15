import type { HttpClient } from '../../http/types/HttpClient'
import { justiciaUrls } from '../session/justiciaUrls'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { parseExpedienteCards } from './parsers/parseExpedienteCards'
import type { JusticiaExpedientesResult } from './types/JusticiaExpedientesResult'

/** The holder's judicial expedientes as the Carpeta Justicia lists them ("Mis expedientes"). Read-only. */
export const listJusticiaExpedientes = async (
  client: HttpClient,
): Promise<JusticiaExpedientesResult> => {
  await loginWithCertificate(client)
  const page = await client.request(justiciaUrls.expedientes)
  if (page.status !== 200)
    throw new Error(
      `Justicia: the expedientes page answered ${String(page.status)}`,
    )
  return {
    expedientes: parseExpedienteCards(page.text),
    notes: [
      'index is the position the Carpeta gives each expediente; the detail and documents commands take it',
    ],
  }
}
