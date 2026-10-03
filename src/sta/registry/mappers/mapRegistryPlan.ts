import type { RegistryPerson } from '../types/RegistryPerson'
import type { StaRegistryQuery } from '../types/StaRegistryQuery'

/** What a confirmed run would file, line by line, for the holder to read before `--confirmar si`. */
export const mapRegistryPlan = (
  host: string,
  person: RegistryPerson,
  query: StaRegistryQuery,
  facts: {
    readonly unitLabel: string
    readonly notificationEmail: string
    readonly files: readonly { readonly name: string; readonly bytes: number }[]
  },
): readonly string[] => [
  `Register at ${host} as ${person.name} ${person.familyname}, addressed to ${facts.unitLabel}`,
  `Subject: ${query.subject}`,
  ...facts.files.map(
    (file, index) =>
      `Attach ${String(index + 1)}: ${file.name} (${String(file.bytes)} bytes)`,
  ),
  `Electronic notifications, notice to ${facts.notificationEmail}`,
]
