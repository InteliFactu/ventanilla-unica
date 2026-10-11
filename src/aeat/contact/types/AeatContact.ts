/**
 * What the AEAT holds to reach a persona física: the avisos channels (mobile,
 * email, their state) and the fiscal and notification addresses of Mis datos
 * censales, label by label as the sede prints them.
 */
export type AeatContact = {
  readonly nif: string
  readonly mobile: string | null
  readonly email: string | null
  readonly avisosState: string | null
  readonly avisosStateDate: string | null
  readonly fiscalAddress: Readonly<Record<string, string>>
  readonly notificationAddress: Readonly<Record<string, string>>
}
