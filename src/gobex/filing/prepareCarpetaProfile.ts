import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { advanceCarpetaPage } from './fetchers/advanceCarpetaPage'
import { fetchCarpetaLocationSelection } from './fetchers/fetchCarpetaLocationSelection'
import { saveCarpetaApplication } from './fetchers/saveCarpetaApplication'
import { buildCarpetaProfileFields } from './mappers/buildCarpetaProfileFields'
import { readCarpetaForm } from './parsers/readCarpetaForm'
import type { CarpetaProfileRequest } from './types/CarpetaProfileRequest'

/** Complete the existing address codes and contact fields without replacing the address. */
export const prepareCarpetaProfile = async (
  client: HttpClient,
  request: CarpetaProfileRequest,
): Promise<HttpResponse> => {
  let page = await client.request(
    'https://sede.gobex.es/SEDE/privado/ciudadanos/exterior.jsf?cod=5637',
  )
  if (
    readCarpetaForm(page.text, page.url, 'formulario').fields[
      'formulario:cas270_ids'
    ] !== '2'
  )
    throw new Error(
      'Junta: profile completion currently supports legal entities only',
    )
  page = await fetchCarpetaLocationSelection(client, page, {
    field: 'cas54',
    code: request.region,
  })
  page = await fetchCarpetaLocationSelection(client, page, {
    field: 'cas38',
    code: request.province,
  })
  page = await fetchCarpetaLocationSelection(client, page, {
    field: 'cas37',
    code: request.municipality,
  })
  const button = await advanceCarpetaPage(client, page, {
    form: 'formulario',
    image: 'bt_continuar',
    fields: buildCarpetaProfileFields(page.text, request),
  })
  if (!button.url.includes('xhtml5637V12'))
    throw new Error(
      'Junta: profile completion did not reach the last form page',
    )
  return saveCarpetaApplication(client, button)
}
