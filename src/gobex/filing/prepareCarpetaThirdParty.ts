import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { advanceCarpetaPage } from './fetchers/advanceCarpetaPage'
import { saveCarpetaApplication } from './fetchers/saveCarpetaApplication'

/** Prepare an ALTA only, authorizing the actual AEAT identity and bank-ownership checks. */
export const prepareCarpetaThirdParty = async (
  client: HttpClient,
  iban: string,
  phone: string,
): Promise<HttpResponse> => {
  const start = await client.request(
    'https://sede.gobex.es/SEDE/privado/ciudadanos/exterior.jsf?cod=5145',
  )
  const banking = await advanceCarpetaPage(client, start, {
    form: 'formulario',
    image: 'bt_continuar',
    fields: { 'formulario:cas42': phone, 'formulario:cas270': 'on' },
  })
  if (!banking.url.includes('xhtml5145V12'))
    throw new Error(
      'Junta: the profile is incomplete; no bank application has been filed',
    )
  return saveCarpetaApplication(client, banking, {
    'formulario:cas130': 'ALTA',
    'formulario:cas130_ids': '8448',
    'formulario:cas131': iban,
    'formulario:cas272': 'on',
  })
}
