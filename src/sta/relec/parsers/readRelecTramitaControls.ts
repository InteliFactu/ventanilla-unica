import { selectRelecTramitaFormId } from '../selectors/selectRelecTramitaFormId'
import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'
import { isOwnedRelecTramitaControl } from '../validators/isOwnedRelecTramitaControl'
import { readRelecFormScope } from './readRelecFormScope'

/** Index active controls by name without collapsing duplicate controls. */
export const readRelecTramitaControls = (
  tags: readonly RelecCatalogueTag[],
  selected: RelecCatalogueTag,
): ReadonlyMap<string, readonly RelecCatalogueTag[]> => {
  const controls = new Map<string, RelecCatalogueTag[]>()
  const formId = selectRelecTramitaFormId(tags, selected)
  const fieldsets: boolean[] = []
  let form: RelecCatalogueTag | undefined
  for (const tag of tags) {
    const { name, closing, attributes } = tag
    switch (name) {
      case 'form': {
        form = readRelecFormScope(form, tag)
        break
      }
      case 'fieldset': {
        if (closing) fieldsets.pop()
        else fieldsets.push(attributes.has('disabled'))
        break
      }
      default: {
        if (
          fieldsets.includes(true) ||
          !isOwnedRelecTramitaControl(tag, form === selected, formId)
        )
          break
        const fieldName = attributes.get('name')
        if (!fieldName) break
        const named = controls.get(fieldName) ?? []
        named.push(tag)
        controls.set(fieldName, named)
      }
    }
  }
  return controls
}
