import type { HttpResponse } from '../../../http/types/HttpResponse'

/** The page carrying the OTP form, and the code to submit on it. */
export type YouthGuaranteeMobileCode = {
  readonly page: HttpResponse
  readonly pin: string
}
