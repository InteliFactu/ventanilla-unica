/** A tiny base64 body that starts like a PDF, for canned justificantes. */
export const fakePdfBase64 = (text: string): string =>
  Buffer.from(`%PDF-1.4 ${text}`).toString('base64')
