import { htmlToText } from '../../html/htmlToText'
import { readTableRowBlocks } from './readTableRowBlocks'

/** The cells of every row of the rich-table `<table id="tableId">`, as text. */
export const parseTableRows = (html: string, tableId: string): string[][] =>
  readTableRowBlocks(html, tableId).map((row) =>
    [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(([, cell = '']) =>
      htmlToText(cell),
    ),
  )
