import type { HttpResponse } from '../../http/types/HttpResponse'

/** A submitted search: the result page and the id of the form that carried it. */
export type GobexSearchSubmission = {
  readonly results: HttpResponse
  readonly formId: string
}
