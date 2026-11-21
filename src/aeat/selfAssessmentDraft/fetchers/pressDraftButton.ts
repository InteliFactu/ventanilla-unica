import type { DraftSession } from '../types/DraftSession'
import { postDraftEvent } from './postDraftEvent'

/** Press one toolbar button, as a mouse click does, and return ZK's answer. */
export const pressDraftButton = async (
  session: DraftSession,
  uuid: string,
): Promise<string> =>
  postDraftEvent(session, {
    cmd: 'onClick',
    uuid,
    data: { pageX: 1, pageY: 1, which: 1, x: 1, y: 1 },
  })
