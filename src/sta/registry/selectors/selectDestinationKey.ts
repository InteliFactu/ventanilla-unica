import type { RegistrySchema } from '../types/RegistrySchema'

/** The internal key of the addressee unit whose label starts with the DIR3 code (`A11030071-...`). */
export const selectDestinationKey = (
  schema: RegistrySchema,
  dir3: string,
): { readonly key: string; readonly label: string } => {
  const field = schema.sections.data.elements
    .flatMap((element) => element.fields)
    .find((candidate) => candidate.id === 'CBDIR3')
  const item = field?.items?.find((candidate) =>
    candidate.label.startsWith(`${dir3}-`),
  )
  if (!item) throw new Error(`no addressee unit with DIR3 code ${dir3}`)
  return item
}
