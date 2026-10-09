import type { HtmlForm } from '../../../html/types/HtmlForm'

/** The "FIRMA DE SOLICITUD" page: the TramitaJustif form and the ids its `firmar()` uses. */
export type RelecSignPage = {
  readonly justif: HtmlForm
  /** `FileUploaderApplet` id to download the unsigned form XML from. */
  readonly inFileId: string
  /** `FileUploaderApplet` id to upload the signed form XML to. */
  readonly outFileId: string
  /** The file name both transfers carry, `formulario_tramite.xml`. */
  readonly fileName: string
}
