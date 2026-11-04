export type YouthGuaranteeStatus = {
  readonly inscribed: boolean | null
  readonly state: 'alta' | 'baja' | 'pendiente' | 'not-inscribed' | 'unknown'
  readonly registrationDate: string | null
  readonly evidence: readonly string[]
}
