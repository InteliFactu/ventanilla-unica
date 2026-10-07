import { unescapeJsString } from '../taxAddress/mappers/unescapeJsString'
import type { M036Session } from '../taxAddress/types/M036Session'
import { typeIntoDeclared } from './typeIntoDeclared'

/**
 * Pick an option of the 036 combobox `widgetId` by its text: one `onChange`
 * with the option label, which the server resolves to the item. `label` is
 * JavaScript-escaped as the 036 prints it.
 */
export const pickComboItem = async (
  session: M036Session,
  widgetId: string,
  label: string,
): Promise<string> =>
  typeIntoDeclared(session, widgetId, unescapeJsString(label))
