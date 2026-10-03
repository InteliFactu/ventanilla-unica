import { htmlToText } from '../../html/htmlToText'
import type { RoleceCertificateRow } from '../types/RoleceCertificateRow'

/**
 * The rows of the `#paginacion` table the certificate search answers. Each
 * row is identifier, name, and two icons whose onclick carries the
 * identifier again (`descargarCertificado('', 'B...')`).
 */
export const readCertificateRows = (
  html: string,
): readonly RoleceCertificateRow[] => {
  const table = /<table[^>]*\sid="paginacion"[^>]*>([\s\S]*?)<\/table>/i.exec(
    html,
  )?.[1]
  const body = /<tbody\b[^>]*>([\s\S]*)/i.exec(table ?? '')?.[1] ?? ''
  return [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].flatMap(
    ([, row = '']) => {
      const cells = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(
        ([, cell = '']) => htmlToText(cell),
      )
      const [nif = '', denominacion = ''] = cells
      if (nif === '') return []
      const inscribed = !/NO INSCRITO/i.test(denominacion)
      return [{ nif, denominacion, inscribed }]
    },
  )
}
