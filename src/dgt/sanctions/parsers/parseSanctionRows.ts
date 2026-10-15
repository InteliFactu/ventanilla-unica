import { unescapeHtml } from '../../../html/unescapeHtml'
import type { DgtSanction } from '../types/DgtSanction'

/**
 * The rows of "Mis sanciones" (`#datatable_sanciones`): each cell carries its
 * column in `data-th`; the denuncia date is an epoch in milliseconds.
 */
export const parseSanctionRows = (html: string): readonly DgtSanction[] =>
  [...html.matchAll(/<tr data="[^"]*">([\s\S]*?)<\/tr>/g)].map(([, row]) => {
    const cells = new Map(
      [
        ...(row ?? '').matchAll(/<td data-th='([^']*)'[^>]*>([\s\S]*?)<\/td>/g),
      ].map(([, name = '', value = '']) => [
        name,
        unescapeHtml(value.replaceAll(/<[^>]*>/g, ' '))
          .replaceAll(/\s+/g, ' ')
          .trim(),
      ]),
    )
    const cell = (name: string): string => cells.get(name) ?? ''
    const epoch = Number(cell('Ver expediente'))
    return {
      expediente: cell('Número de expediente'),
      asunto: cell('Asunto'),
      estado: cell('Estado'),
      fechaDenuncia:
        Number.isFinite(epoch) && epoch > 0
          ? new Date(epoch).toISOString().slice(0, 10)
          : '',
      provincia: cell('Provincia'),
      importe: cell('Importe'),
    }
  })
