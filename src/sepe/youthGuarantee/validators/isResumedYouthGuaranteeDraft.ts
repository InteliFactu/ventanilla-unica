import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

/** After a saved step the login resumes the wizard on that step, not on step 1. */
export const isResumedYouthGuaranteeDraft = (url: string): boolean => {
  const parsed = new URL(url)
  return (
    parsed.origin === youthGuaranteeUrls.origin &&
    /^\/solicitudPaso[2-6](?:\.action)?$/.test(parsed.pathname)
  )
}
