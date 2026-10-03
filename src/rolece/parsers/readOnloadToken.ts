/**
 * The token `body_load()` writes into the signing form when the page loads:
 * it replaces the one the hidden input is served with, so it is the value a
 * browser posts.
 */
export const readOnloadToken = (html: string): string | undefined =>
  /getElementById\("token"\)\.value\s*=\s*"([^"]+)"/.exec(html)?.[1]
