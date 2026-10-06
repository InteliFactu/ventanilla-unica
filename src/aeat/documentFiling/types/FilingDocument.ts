/** One file to attach: its name as the registry shows it, the document type code and its bytes. */
export type FilingDocument = {
  readonly name: string
  /** The registry's "Tipo de Documento" code: 200 otros, 203 alegaciones, 227 representación, ... */
  readonly type: string
  readonly content: Buffer
}
