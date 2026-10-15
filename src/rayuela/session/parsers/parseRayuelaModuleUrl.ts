import { unescapeHtml } from '../../../html/unescapeHtml'
import { validateRayuelaUrl } from '../validators/validateRayuelaUrl'
/** The module uses a single-quoted form value, not a redirect. */
export const parseRayuelaModuleUrl = (html: string): string => {
  const value =
    /["'](https:\/\/rayuela\.educarex\.es\/segedu\/jsp\/EntradaDirectaUsuario\.jsp\?[^"']+)["']/i.exec(
      html,
    )?.[1]
  if (!value) throw new Error('Rayuela module entry was not found')
  return validateRayuelaUrl(unescapeHtml(value))
}
