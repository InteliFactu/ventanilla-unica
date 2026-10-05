/** The texts the request document carries besides the form: header, footers and the server's HMAC ("HUELLA"). */
export type DgsfpPdfTexts = {
  readonly titleHeader: string
  readonly footer: string
  readonly footAddress: string
  readonly hmac: string
}
