import type { RegistryQuery } from '../types/RegistryQuery'

/**
 * The `consultaRegistros` body exactly as the front's Escritos y solicitudes
 * page posts it: `tipoTraza` "1" and `historico` "1" are constants there, the
 * dates go as Angular serialises a `Date` (ISO, UTC), and `posicionInicial` is
 * the 1-based index of the first entry of the page. `numRegistro` is only sent
 * when filtering by one registry number.
 */
export const buildRegistryRequestBody = (
  query: RegistryQuery,
  position: number,
  size: number,
): string => {
  const criterios = {
    fechaInicial: query.from.toISOString(),
    fechaFinal: query.to.toISOString(),
    tipoTraza: '1',
    historico: '1',
    ...(query.number ? { numRegistro: query.number } : {}),
  }
  return JSON.stringify({
    criterios,
    paginacion: { posicionInicial: position, numResultados: size },
  })
}
