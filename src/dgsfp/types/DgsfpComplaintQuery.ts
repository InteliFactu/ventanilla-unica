/** The `dgsfp reclamacion` options, checked. Paths are the holder's own PDFs. */
export type DgsfpComplaintQuery = {
  readonly entity: string
  readonly entityNif: string
  readonly entityDetail: string
  readonly sacDate?: string | undefined
  readonly lawsuits: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly province: string
  readonly municipality: string
  readonly town: string
  readonly postalCode: string
  readonly files: {
    readonly escrito: string
    readonly sac: string
    readonly condiciones?: string | undefined
    readonly anexo?: string | undefined
  }
}
