/** The files a Carpeta Ciudadana download wrote: the notification PDF and, when the sede serves it as a PDF, the acuse. */
export type CarpetaNotificationFiles = {
  readonly notification: string
  readonly acuse: string | null
}
