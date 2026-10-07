import type { AeatExpediente } from '../types/AeatExpediente'
import { parseExpedienteRow } from './parseExpedienteRow'

/** Read the AEAT root table; its five columns include the detail link. */
export const parseExpedienteRows = (
  html: string,
): readonly AeatExpediente[] => {
  const table =
    /<table[^>]*title=['"]Listado de expedientes asociados['"][^>]*>([\s\S]*?)<\/table>/i.exec(
      html,
    )?.[1]
  if (!table) throw new Error('AEAT: expediente list table was not returned')
  const rows: AeatExpediente[] = []
  for (const [, row = ''] of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const parsed = parseExpedienteRow(row)
    if (parsed) rows.push(parsed)
  }
  return rows
}
