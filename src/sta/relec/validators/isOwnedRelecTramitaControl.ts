import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'

/** Check that the active control belongs to the selected form. */
export const isOwnedRelecTramitaControl = (
  tag: RelecCatalogueTag,
  withinSelected: boolean,
  formId: string | undefined,
): boolean => {
  const { name, closing, attributes } = tag
  if (
    closing ||
    !/^(?:input|textarea|select|button|object)$/.test(name) ||
    attributes.has('disabled')
  )
    return false
  const owner = attributes.get('form')
  return owner === undefined ? withinSelected : owner === formId
}
