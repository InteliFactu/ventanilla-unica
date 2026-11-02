import type { EconomicActivity } from '../types/EconomicActivity'

/**
 * Read `--actividades` as `tipo;seccion;epigrafe;descripcion`, several joined
 * by `|` (e.g. `A05;2;763;Programadores y Analistas de Informática`).
 */
export const parseActivities = (raw: string | undefined): EconomicActivity[] =>
  (raw ?? '')
    .split('|')
    .map((entry) => entry.trim())
    .filter((entry) => entry !== '')
    .map((entry) => {
      const [tipo = '', seccion = '', epigrafe = '', descripcion = ''] = entry
        .split(';')
        .map((part) => part.trim())
      return {
        tipo: tipo.toUpperCase(),
        seccion,
        epigrafe: epigrafe.replaceAll('.', ''),
        descripcion,
      }
    })
