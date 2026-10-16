/** The mercantil search by NIF, as the busqueda form posts it; the selection step posts it again. */
export const mapSearchFields = (nif: string): Record<string, string> => ({
  page: '0',
  searchType: 'SOCIEDAD',
  searchSociedadType: 'NIF',
  searchText: nif,
  codRegistro: '',
})
