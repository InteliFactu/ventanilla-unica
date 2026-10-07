import { dispatchM036Event } from '../taxAddress/dispatchM036Event'
import type { M036Session } from '../taxAddress/types/M036Session'
import { findDeclaredUuid } from './parsers/findDeclaredUuid'

/** Tick a 036 checkbox or radio by id (one `onCheck`). */
export const checkDeclared = async (
  session: M036Session,
  widgetId: string,
): Promise<string> =>
  dispatchM036Event(session, {
    cmd: 'onCheck',
    uuid: findDeclaredUuid(session.blobs, widgetId),
    data: { '': true },
  })
