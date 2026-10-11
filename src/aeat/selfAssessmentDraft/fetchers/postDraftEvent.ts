import { draftSimulatorBaseUrl } from '../draftSimulatorBaseUrl'
import { draftAppPath } from '../mappers/draftAppPath'
import type { DraftEvent } from '../types/DraftEvent'
import type { DraftSession } from '../types/DraftSession'

/** Send one ZK event to the simulator, with the next ZK-SID. */
export const postDraftEvent = async (
  session: DraftSession,
  event: DraftEvent,
): Promise<string> => {
  session.sid += 1
  const response = await session.client.request(
    `${draftSimulatorBaseUrl}${draftAppPath(session.modelo)}/pwda/zkau`,
    {
      method: 'POST',
      form: {
        dtid: session.desktopId,
        cmd_0: event.cmd,
        uuid_0: event.uuid,
        data_0: JSON.stringify(event.data),
      },
      headers: { 'ZK-SID': String(session.sid) },
      referer: session.pageUrl,
    },
  )
  return response.text
}
