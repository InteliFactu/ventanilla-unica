import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'
import { isEditableRelecTramitaControl } from '../validators/isEditableRelecTramitaControl'

/** Identify editable text controls inside the form that submits the catalogue procedure. */
export const readRelecTramiteTextFields = (
  controls: ReadonlyMap<string, readonly RelecCatalogueTag[]>,
): ReadonlySet<string> =>
  new Set(
    [...controls].flatMap(([name, tags]) =>
      name.startsWith('DinVar') &&
      tags.length === 1 &&
      tags.every(isEditableRelecTramitaControl)
        ? [name.slice('DinVar'.length)]
        : [],
    ),
  )
