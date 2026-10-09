import type { RegistryContact } from './RegistryContact'

/**
 * A person as `GET /people/me/<reference>` returns it, the holder or one of
 * the entities in its `represented`; sent back verbatim as a party. A legal
 * person has `cianame` and no name parts.
 */
export type RegistryPerson = Readonly<Record<string, unknown>> & {
  readonly dboid: string
  readonly name: string | null
  readonly familyname: string | null
  readonly secondname?: string | null | undefined
  readonly cianame?: string | null | undefined
  readonly idnumber: string
  readonly ctrldigit: string
  readonly persontype: string
  readonly addreses: readonly Readonly<Record<string, unknown>>[] | null
  readonly contacts: readonly RegistryContact[]
  readonly represented?: readonly RegistryPerson[] | null | undefined
  /** On a represented entity: the certificate only lets the holder act for it. */
  readonly onlyagent?: boolean | null | undefined
}
