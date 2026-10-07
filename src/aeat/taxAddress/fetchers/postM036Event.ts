import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'
import { asciiJson } from '../mappers/asciiJson'
import type { M036Event } from '../types/M036Event'

/** Send one ZK event to the BU36-M036 `zkau`, in the browser's field order. */
export const postM036Event = async (
  client: HttpClient,
  desktopId: string,
  event: M036Event,
): Promise<string> => {
  const response = await client.request(`${aeatBaseUrl}/wlpl/BU36-M036/zkau`, {
    method: 'POST',
    form: {
      dtid: desktopId,
      cmd_0: event.cmd,
      uuid_0: event.uuid,
      data_0: asciiJson(event.data),
    },
    referer: `${aeatBaseUrl}/wlpl/BU36-M036/MOD036/index.zul`,
  })
  return response.text
}
