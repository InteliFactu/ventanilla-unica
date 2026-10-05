/** The SharePoint form digest (`__REQUESTDIGEST`) every service call sends as `X-RequestDigest`. */
export const readRequestDigest = (html: string): string | undefined =>
  /id="__REQUESTDIGEST"[^>]*value="([^"]+)"/.exec(html)?.[1]
