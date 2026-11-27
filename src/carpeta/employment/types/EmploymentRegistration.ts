/** The job-seeker status reported by Mi Carpeta Ciudadana for the queried day. */
export type EmploymentRegistration = {
  readonly registered: boolean
  readonly registeredSince: string | null
}
