import { dispatchM036Event } from '../taxAddress/dispatchM036Event'
import type { M036Session } from '../taxAddress/types/M036Session'
import { findDeclaredUuid } from './parsers/findDeclaredUuid'

/** Type `value` into a 036 input whose id follows other properties (Datebox, popup fields). */
export const typeIntoDeclared = async (
  session: M036Session,
  widgetId: string,
  value: string,
): Promise<string> =>
  dispatchM036Event(session, {
    cmd: 'onChange',
    uuid: findDeclaredUuid(session.blobs, widgetId),
    data: { value, start: value.length },
  })
