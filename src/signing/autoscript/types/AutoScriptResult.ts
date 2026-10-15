/** What AutoFirma hands back to the page's success callback. */
export type AutoScriptResult = {
  /** The signature (or signed document), base64. */
  readonly signature: string
  /** The signer certificate, base64 DER. */
  readonly certificate: string
}
