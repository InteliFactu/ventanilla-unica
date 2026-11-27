import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'

/** Determine the active form without guessing ownership in nested forms. */
export const readRelecFormScope = (
  form: RelecCatalogueTag | undefined,
  tag: RelecCatalogueTag,
): RelecCatalogueTag | undefined => {
  if (tag.closing) return undefined
  if (form)
    throw new Error('TramitaForm carried nested forms; nothing was prepared')
  return tag
}
