import { unescapeHtml } from '../../../html/unescapeHtml'
import type { CollaboratingEntity } from '../types/CollaboratingEntity'

/** Each table row: a cell with the four-digit code, then a cell whose first link is the bank's name. */
export const parseCollaboratingEntities = (
  html: string,
): readonly CollaboratingEntity[] =>
  [
    ...html.matchAll(
      /<td[^>]*>\s*<span[^>]*>\s*(\d{4})\s*<\/span>\s*<\/td>\s*<td[^>]*>\s*<span[^>]*>\s*<a[^>]*>([^<]+)<\/a>/g,
    ),
  ].map(([, codigo = '', nombre = '']) => ({
    codigo,
    nombre: unescapeHtml(nombre).trim(),
  }))
