/** What `junta carpeta-comparecer` was asked: the notification number, whether to act, and where to save the PDFs. */
export type CarpetaAcceptanceRequest = {
  readonly id: string
  readonly confirm: boolean
  readonly outDir?: string | undefined
}
