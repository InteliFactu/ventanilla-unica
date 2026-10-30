import { unescapeHtml } from '../../../html/unescapeHtml'
import type { DgtVehicle } from '../types/DgtVehicle'

/** The rows of "Mis vehiculos" (`table.tabla-vehiculos`): each cell names its column in `data-th`. */
export const parseVehicleRows = (html: string): readonly DgtVehicle[] => {
  const start = html.indexOf('tabla-vehiculos')
  const table =
    start < 0 ? '' : html.slice(start, html.indexOf('</table>', start))
  return [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].flatMap(([, row]) => {
    const cells = new Map(
      [
        ...(row ?? '').matchAll(/<td data-th="([^"]*)"[^>]*>([\s\S]*?)<\/td>/g),
      ].map(([, name = '', value = '']) => [
        name,
        unescapeHtml(value.replaceAll(/<[^>]*>/g, ' '))
          .replaceAll(/\s+/g, ' ')
          .trim(),
      ]),
    )
    const cell = (name: string): string => cells.get(name) ?? ''
    return cells.size === 0
      ? []
      : [
          {
            matricula: cell('Matrícula'),
            matriculacion: cell('Matriculación'),
            marca: cell('Marca'),
            modelo: cell('Modelo'),
            combustible: cell('Combustible'),
          },
        ]
  })
}
