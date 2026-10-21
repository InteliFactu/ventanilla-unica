import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { readCarpetaOptionLabel } from '../parsers/readCarpetaOptionLabel'
import type { CarpetaLocationStep } from '../types/CarpetaLocationStep'
import { postCarpetaStep } from './postCarpetaStep'

/** Select one actual territorial option, allowing the sede to populate its dependent list. */
export const fetchCarpetaLocationSelection = async (
  client: HttpClient,
  page: HttpResponse,
  step: CarpetaLocationStep,
): Promise<HttpResponse> =>
  postCarpetaStep(client, page, 'formulario', {
    [`formulario:${step.field}`]: readCarpetaOptionLabel(
      page.text,
      step.field,
      step.code,
    ),
    [`formulario:${step.field}_ids`]: step.code,
    [`formulario:${step.field}_support`]: `formulario:${step.field}_support`,
    ajaxSingle: `formulario:${step.field}_ids`,
    AJAXREQUEST: 'formulario:editando',
  })
