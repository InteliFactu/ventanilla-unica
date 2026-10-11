import type { HttpClient } from '../../http/types/HttpClient'
import { fetchSaviContact } from './fetchers/fetchSaviContact'
import { readDgtJson } from './parsers/readDgtJson'
import { readSaviContact } from './parsers/readSaviContact'
import type { DgtContact } from './types/DgtContact'

/** The holder's contact data at the DGT, fetched and read; undefined when there is none. */
export const readContact = async (
  client: HttpClient,
): Promise<DgtContact | undefined> =>
  readSaviContact(readDgtJson(await fetchSaviContact(client), 'contact data'))
