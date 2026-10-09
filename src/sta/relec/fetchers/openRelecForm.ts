import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { buildFrameForm } from '../builders/buildFrameForm'
import { relecProcedure } from '../relecProcedure'

/**
 * Open the procedure the way the catalogue's "Tramitar" link does: post
 * `frame.jsp` (which binds the procedure to the session), then load
 * `Relec/TramitaForm` with the query string the frame's iframe uses. The page
 * is served in ISO-8859-1.
 */
export const openRelecForm = async (
  client: HttpClient,
  origin: string,
): Promise<HttpResponse> => {
  await client.request(`${origin}/sta/frame.jsp`, {
    method: 'POST',
    form: buildFrameForm(),
  })
  const urlBack = encodeURIComponent(
    ` /sta/CarpetaPublic/?APP_CODE=STA&PAGE_CODE=CATALOGO&DETALLE=${relecProcedure}`,
  ).replace('%20', '+')
  return client.request(
    `${origin}/sta/Relec/TramitaForm?dboidSolicitud=${relecProcedure}&urlBack=${urlBack}&autoFirma=true&&&fire=false&&frame=true`,
    { defaultCharset: 'iso-8859-1', referer: `${origin}/sta/frame.jsp` },
  )
}
