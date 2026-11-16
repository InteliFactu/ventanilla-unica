/** Decodes an answer as UTF-8 when it is valid UTF-8, otherwise as Latin-1: the portal answers some templates in each. */
export const decodeRayuelaAnswer = (body: Buffer): string => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(body)
  } catch {
    return body.toString('latin1')
  }
}
