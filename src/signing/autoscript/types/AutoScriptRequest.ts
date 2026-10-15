/** What a sede page hands `AutoScript.sign(data, algorithm, format, extraParams)`. */
export type AutoScriptRequest = {
  /** The data to sign, base64 as AutoScript takes it. */
  readonly data: string
  readonly algorithm: string
  readonly format: string
  /** Java properties text, one `key=value` per line; may be empty. */
  readonly extraParams?: string | undefined
}
