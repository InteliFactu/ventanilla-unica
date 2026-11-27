/** Local invoice and RPC-literal SOAP request for the FACe supplier binding. */
export type FaceRequest = {
  readonly invoice: Buffer
  readonly soap: Buffer
  readonly soapAction: string
}
