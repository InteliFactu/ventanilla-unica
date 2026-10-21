import { redactCarpetaInput } from './redactCarpetaInput'

/** Remove transient JSF state and signature callback values from archived HTML evidence. */
export const redactCarpetaEvidence = (html: string): string =>
  html.replace(/<input\b[^>]+>/gi, redactCarpetaInput)
