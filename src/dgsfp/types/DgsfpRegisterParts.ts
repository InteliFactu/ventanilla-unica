/** The telematic number, documents and certificate a registration request is built from. */
export type DgsfpRegisterParts = {
  readonly numTelematico: string
  readonly document: Buffer
  readonly signedDocument: Buffer
  readonly certificateDerBase64: string
}
