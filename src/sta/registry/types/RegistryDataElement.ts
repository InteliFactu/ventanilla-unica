import type { RegistryField } from './RegistryField'

/** A group of form fields; the API saves values grouped the same way. */
export type RegistryDataElement = {
  readonly id: string
  readonly fields: readonly RegistryField[]
}
