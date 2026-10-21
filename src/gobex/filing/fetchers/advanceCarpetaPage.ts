import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { selectCarpetaButton } from '../selectors/selectCarpetaButton'
import type { CarpetaButtonStep } from '../types/CarpetaButtonStep'
import { postCarpetaStep } from './postCarpetaStep'

/** Advance a known page using its actual button component. */
export const advanceCarpetaPage = async (
  client: HttpClient,
  page: HttpResponse,
  step: CarpetaButtonStep,
): Promise<HttpResponse> => {
  const button = selectCarpetaButton(page.text, step.image)
  return postCarpetaStep(client, page, step.form, {
    ...step.fields,
    [button]: button,
  })
}
