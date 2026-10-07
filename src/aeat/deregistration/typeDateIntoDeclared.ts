import { dispatchM036Event } from '../taxAddress/dispatchM036Event'
import type { M036Session } from '../taxAddress/types/M036Session'
import { zkDateValue } from './mappers/zkDateValue'
import { findDeclaredUuid } from './parsers/findDeclaredUuid'

/** Set a 036 Datebox to a DD/MM/YYYY date, encoded as ZK's own client does. */
export const typeDateIntoDeclared = async (
  session: M036Session,
  widgetId: string,
  date: string,
): Promise<string> =>
  dispatchM036Event(session, {
    cmd: 'onChange',
    uuid: findDeclaredUuid(session.blobs, widgetId),
    data: { value: zkDateValue(date), z$dateKeys: ['value'] },
  })
