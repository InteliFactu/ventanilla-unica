import { mapGridRow } from '../../mappers/mapGridRow'
import { parseTableRows } from '../../parsers/parseTableRows'
import type { GobexGrid } from '../../types/GobexGrid'
import type { CarpetaNotificationRow } from '../types/CarpetaNotificationRow'
import { readRowLinks } from './readRowLinks'

/**
 * The notification rows of one grid page, keyed by the column titles of the
 * first page (a scroller page is a fragment without them), each with its
 * action link.
 */
export const parseNotificationRows = (
  html: string,
  grid: Pick<GobexGrid, 'id' | 'headers'>,
): CarpetaNotificationRow[] => {
  const links = readRowLinks(html, grid.id)
  return parseTableRows(html, grid.id).map((cells, index) => ({
    record: mapGridRow(grid.headers, cells),
    link: links[index],
  }))
}
