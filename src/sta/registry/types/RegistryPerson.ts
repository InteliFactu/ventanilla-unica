import type { RegistryContact } from './RegistryContact'

/** The holder as `GET /people/me/<reference>` returns it; sent back verbatim as the interested party. */
export type RegistryPerson = Readonly<Record<string, unknown>> & {
  readonly dboid: string
  readonly name: string
  readonly familyname: string
  readonly secondname?: string | null | undefined
  readonly idnumber: string
  readonly ctrldigit: string
  readonly persontype: string
  readonly addreses: readonly Readonly<Record<string, unknown>>[]
  readonly contacts: readonly RegistryContact[]
}
