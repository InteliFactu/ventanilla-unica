import type { Successor } from '../types/Successor'

/**
 * Read `--sucesores` as `NIF;Nombre;porcentaje;cuota`, several joined by `|`
 * (e.g. `11111111H;GARCIA ANA;50;0,00|22222222J;PEREZ LUIS;50;0,00`).
 */
export const parseSuccessors = (raw: string | undefined): Successor[] =>
  (raw ?? '')
    .split('|')
    .map((entry) => entry.trim())
    .filter((entry) => entry !== '')
    .map((entry) => {
      const [nif = '', nombre = '', porcentaje = '', cuota = ''] = entry
        .split(';')
        .map((part) => part.trim())
      return { nif: nif.toUpperCase(), nombre, porcentaje, cuota }
    })
