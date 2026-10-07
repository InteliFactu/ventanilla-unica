import type { RegistrationReceipt } from './RegistrationReceipt'

/** The receipt of a filed application and the notes about saving it. */
export type FiledApplicationResult = {
  readonly receipt: RegistrationReceipt
  readonly notes: string[]
}
