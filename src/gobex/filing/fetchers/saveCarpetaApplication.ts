import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { advanceCarpetaPage } from './advanceCarpetaPage'
import { postCarpetaStep } from './postCarpetaStep'

/** Save the completed form, acknowledge the save and pass the optional-attachments page. */
export const saveCarpetaApplication = async (
  client: HttpClient,
  page: HttpResponse,
  fields: Readonly<Record<string, string>> = {},
): Promise<HttpResponse> => {
  const saved = await advanceCarpetaPage(client, page, {
    form: 'formulario',
    image: 'bt_continuar',
    fields,
  })
  const attachments = await postCarpetaStep(client, saved, 'formulario', {
    'formulario:aceptarOK': 'formulario:aceptarOK',
  })
  if (!attachments.url.includes('/docAdjuntos.jsf'))
    throw new Error('Junta: saving did not reach the attachment page')
  return advanceCarpetaPage(client, attachments, {
    form: 'f_formulario',
    image: 'bt_continuar',
  })
}
