import type { HttpClient } from '../../http/types/HttpClient'
import { detectContactPrompt } from '../session/detectContactPrompt'
import { oargtUrls } from '../session/oargtUrls'
import { parseOargtLiquidations } from './parsers/parseOargtLiquidations'
import type { OargtLiquidationsResult } from './types/OargtLiquidationsResult'

/**
 * Log in with the client certificate and read "Mis liquidaciones". The
 * "Crear nueva liquidación" button is never pressed, and the contact-data
 * confirmation gate is reported, never answered.
 */
export const listOargtLiquidations = async (
  client: HttpClient,
): Promise<OargtLiquidationsResult> => {
  await client.request(oargtUrls.public)
  const page = await client.request(oargtUrls.liquidacionesCertificate)
  if (detectContactPrompt(page.text))
    return {
      contactConfirmationPending: true,
      notes: [
        'the office asked to confirm contact data before showing liquidations; this is a write and was left for the holder',
      ],
    }
  return parseOargtLiquidations(page.text)
}
