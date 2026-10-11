import { readAttribute } from '../../../html/readAttribute'

/**
 * The value Importass preselects in a `<select>`: it renders no `selected`
 * option and keeps the stored value in `data-valor` for its script to apply.
 */
export const readSelectDataValue = (html: string, name: string): string => {
  for (const [tag] of html.matchAll(/<select\b[^>]*>/gi))
    if (readAttribute(tag, 'name') === name)
      return readAttribute(tag, 'data-valor') ?? ''
  return ''
}
