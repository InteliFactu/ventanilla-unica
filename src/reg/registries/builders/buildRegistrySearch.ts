/**
 * The front's default "Mis registros" filter, newest first. `pageNumber` is
 * one-based: 0 and 1 both answer the first page.
 */
export const buildRegistrySearch = (page: number): string =>
  JSON.stringify({
    registryNumber: '',
    organicUnit: '',
    registryStatus: '',
    actLike: '',
    registryToDate: '',
    registryFromDate: '',
    registryPagination: { pageNumber: page, pageSize: 10, order: 'DESC' },
  })
