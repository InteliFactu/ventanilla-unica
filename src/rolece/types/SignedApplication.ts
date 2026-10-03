/** The application document after the AutoFirma-equivalent XAdES signature. */
export type SignedApplication = {
  /** The signed XML in the document's own ISO-8859-1, as AutoFirma returns it. */
  readonly xml: Buffer
  /** Subject of the signing certificate. */
  readonly signer: string
}
