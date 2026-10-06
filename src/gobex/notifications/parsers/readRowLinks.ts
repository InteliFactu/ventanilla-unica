import { unescapeHtml } from '../../../html/unescapeHtml'
import { readTableRowBlocks } from '../../parsers/readTableRowBlocks'

/**
 * The JSF command-link parameter of each row of grid `tableId`, in row order.
 * The action link is an `<a onclick="jsfcljs(form, {'p':'p'}, '')">`: a
 * click adds the hidden field `p=p` to the list form and submits it. The
 * parameter is a `j_id` that changes between releases, so it is read, never
 * built.
 */
export const readRowLinks = (
  html: string,
  tableId: string,
): (string | undefined)[] =>
  readTableRowBlocks(html, tableId).map(
    (row) =>
      /jsfcljs\(document\.getElementById\('[^']*'\),\{'([^']+)':'\1'/.exec(
        unescapeHtml(row),
      )?.[1],
  )
