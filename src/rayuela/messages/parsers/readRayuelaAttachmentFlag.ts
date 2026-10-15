/** The absence icon is sinAdjunto.png; adjunto.png denotes attachments. */
export const readRayuelaAttachmentFlag = (html: string): boolean =>
  /<img\s[^>]*src=['"][^'"]*\/(?:conAdjunto|adjunto)\.png['"]/i.test(html)
