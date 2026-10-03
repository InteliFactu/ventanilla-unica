import type { RegistryFieldItem } from './RegistryFieldItem'

/** One input of the registry form, as the procedure schema declares it. */
export type RegistryField = {
  readonly id: string
  readonly type?: string | null | undefined
  readonly items?: readonly RegistryFieldItem[] | null | undefined
}
