import type { ImportassAddress } from './ImportassAddress'

/** What "Tus datos personales" shows: identity, contact data and domicile. Empty strings where the holder gave none. */
export type ImportassPersonalData = {
  readonly name: string
  readonly birthDate: string
  readonly identifier: string
  readonly naf: string
  readonly landline: string
  readonly mobilePrefix: string
  readonly mobile: string
  readonly email: string
  readonly address: ImportassAddress
}
