import type { AutoScriptOperation } from './AutoScriptOperation'

/**
 * What a sede page hands `AutoScript.sign(data, algorithm, format,
 * extraParams)`, `coSign(signature, data, ...)` or `counterSign(signature, ...)`.
 */
export type AutoScriptRequest = {
  /** Default `sign`. */
  readonly operation?: AutoScriptOperation | undefined
  /** The existing signature to cosign or countersign, base64. */
  readonly signature?: string | undefined
  /** The data to sign, base64 as AutoScript takes it; for a cosignature, the detached content or empty. */
  readonly data: string
  readonly algorithm: string
  readonly format: string
  /** Java properties text, one `key=value` per line; may be empty. */
  readonly extraParams?: string | undefined
}
