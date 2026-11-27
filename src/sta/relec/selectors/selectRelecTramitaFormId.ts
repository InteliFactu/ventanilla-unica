import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'

/** Resolve explicit form ownership only when the selected form ID is unique. */
export const selectRelecTramitaFormId = (
  tags: readonly RelecCatalogueTag[],
  selected: RelecCatalogueTag,
): string | undefined => {
  const id = selected.attributes.get('id')
  return id &&
    tags.filter(({ attributes }) => attributes.get('id') === id).length === 1
    ? id
    : undefined
}
