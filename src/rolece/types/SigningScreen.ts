/**
 * The "Solicitud de Inscripción en el Registro pendiente de ser firmada"
 * screen: the document its Firmar button hands to AutoFirma and the form the
 * signature is posted back in.
 */
export type SigningScreen = {
  /** The screen's own URL, the referer of the signed post. */
  readonly url: string
  /** Absolute URL `firmaExito` submits to (`firmaSolicitud!firmarSolicitud`). */
  readonly action: string
  /** The form's fields as the browser submits them, before the signature fills `firma` and `xmlFirmado`. */
  readonly fields: Readonly<Record<string, string>>
  /** The application document (`campoXML`), decoded from the page. */
  readonly document: string
}
