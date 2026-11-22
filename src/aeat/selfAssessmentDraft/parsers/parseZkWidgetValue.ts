import { unescapeZkLabel } from '../../filings/mappers/unescapeZkLabel'

/** The `_value` of the ZK input with id `widgetId` (a textbox or combobox), or undefined. */
export const parseZkWidgetValue = (
  text: string,
  widgetId: string,
): string | undefined => {
  const at = text.indexOf(`{id:'${widgetId}'`)
  if (at < 0) return undefined
  const value = /_value:'((?:[^'\\]|\\.)*)'/.exec(text.slice(at))?.[1]
  return value === undefined ? undefined : unescapeZkLabel(value)
}
