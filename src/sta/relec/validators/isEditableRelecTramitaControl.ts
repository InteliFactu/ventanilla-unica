import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'

/** Permit visible editable text inputs and textareas as dynamic overrides. */
export const isEditableRelecTramitaControl = (
  tag: RelecCatalogueTag,
): boolean => {
  const { name, attributes } = tag
  if (attributes.has('readonly') || attributes.has('hidden')) return false
  const type = attributes.get('type')?.toLowerCase() ?? 'text'
  return name === 'textarea' || (name === 'input' && type === 'text')
}
