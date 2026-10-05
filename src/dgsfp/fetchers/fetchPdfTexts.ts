import type { HttpClient } from '../../http/types/HttpClient'
import type { DgsfpPdfTexts } from '../types/DgsfpPdfTexts'
import { callDgsfpService } from './callDgsfpService'

/**
 * What the review step fetches before drawing the request document: three
 * configuration texts and `generarHMAC` over the very `datosFormulario`
 * string that will be registered. The HMAC only computes; it saves nothing.
 */
export const fetchPdfTexts = async (
  client: HttpClient,
  digest: string,
  datosFormulario: string,
): Promise<DgsfpPdfTexts> => {
  const parameter = async (name: string): Promise<string> =>
    (await callDgsfpService(
      client,
      digest,
      `RestService.svc/getParametroValue?pk=${encodeURI(name)}`,
    )) as string
  const [titleHeader, footer, footAddress, hmac] = await Promise.all([
    parameter('Pdf Presentacion Telematica - Titulo Cabecera'),
    parameter('Pdf Presentacion Telematica - Pie Pagina'),
    parameter('Pdf Presentacion Telematica - Pie Direccion'),
    callDgsfpService(client, digest, 'RestService.svc/generarHMAC', {
      datosFormulario,
    }) as Promise<string>,
  ])
  if (!titleHeader || !footer || !footAddress || !hmac)
    throw new Error('DGSFP: the sede gave no header, footer or HMAC')
  return { titleHeader, footer, footAddress, hmac }
}
