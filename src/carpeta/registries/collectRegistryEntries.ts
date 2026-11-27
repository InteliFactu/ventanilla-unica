import type { HttpClient } from '../../http/types/HttpClient'
import { appendRegistryEntries } from './appendRegistryEntries'
import { appendWarning } from './appendWarning'
import { buildRegistryRequestBody } from './builders/buildRegistryRequestBody'
import { fetchRegistryPage } from './fetchers/fetchRegistryPage'
import { readRegistryPage } from './parsers/readRegistryPage'
import { registryPageSize } from './registryPageSize'
import type { RegistryEntry } from './types/RegistryEntry'
import type { RegistryListing } from './types/RegistryListing'
import type { RegistryQuery } from './types/RegistryQuery'
import { validateRegistryResultPage } from './validators/validateRegistryResultPage'

/** Collect every reported entry from `consultaRegistros` and keep distinct page warnings. */
export const collectRegistryEntries = async (
  client: HttpClient,
  token: string,
  query: RegistryQuery,
): Promise<RegistryListing> => {
  const entries: RegistryEntry[] = []
  const seen = new Set<string>()
  const warnings: string[] = []
  let total: number | undefined
  do {
    const page = readRegistryPage(
      await fetchRegistryPage(
        client,
        token,
        buildRegistryRequestBody(query, entries.length + 1, registryPageSize),
      ),
    )
    total ??= page.total
    validateRegistryResultPage(page, total, entries.length, query.number)
    appendRegistryEntries(entries, seen, page.entries)
    appendWarning(warnings, page.warning)
  } while (entries.length < total)
  return { total, entries, warnings }
}
