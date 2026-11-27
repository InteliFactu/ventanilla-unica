import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'
import { findRelecTramitaForm } from './findRelecTramitaForm'
import { readRelecCatalogueTags } from './readRelecCatalogueTags'
import { readRelecTramitaControls } from './readRelecTramitaControls'

/** Read control ownership from the same form for discovery and filing. */
export const readRelecTramitaFormControls = (
  html: string,
  pageUrl: string,
): ReadonlyMap<string, readonly RelecCatalogueTag[]> => {
  const tags = readRelecCatalogueTags(html)
  return readRelecTramitaControls(tags, findRelecTramitaForm(tags, pageUrl))
}
