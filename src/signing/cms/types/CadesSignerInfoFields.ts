/** Raw DER fields of a SignerInfo, with unsigned attributes separated. */
export type CadesSignerInfoFields = {
  readonly signedFields: readonly Buffer[]
  readonly unsignedAttributes: readonly Buffer[]
}
