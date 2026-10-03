/** What `rolece solicitud` was asked to file, checked offline. */
export type RegistrationQuery = {
  readonly nif: string
  /** Label or code of the comunidad autónoma of the registered office ("Extremadura", "ES43"). */
  readonly comunidad: string
  /** Label or code of the province ("Cáceres", "ES432"). */
  readonly provincia: string
  /** The company's notification address ("Dirección de Notificación del Interesado"). */
  readonly email: string
  /** The applicant's notification address; the company's when not given. */
  readonly emailSolicitante: string
  readonly escritura?: string | undefined
  readonly poderes?: string | undefined
}
