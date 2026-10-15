import type { HttpClient } from '../../http/types/HttpClient'
import { extractStaDatasets } from '../parsers/extractStaDatasets'
import type { StaDatasets } from '../types/StaDatasets'
import { fetchStaPageText } from './fetchStaPageText'

/** Open a private STA page and return the datasets it embeds (its default tab). */
export const fetchStaPage = async (
  client: HttpClient,
  origin: string,
  pageCode: string,
): Promise<StaDatasets> =>
  extractStaDatasets(await fetchStaPageText(client, origin, pageCode))
