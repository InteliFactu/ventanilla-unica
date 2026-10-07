/** The "Nuevo" button of the successor table, the first `_id_nuevo` after `tablaSucesores`. */
export const findSuccessorNewButton = (html: string): string => {
  const table = html.indexOf("id:'tablaSucesores'")
  const uuid =
    table < 0
      ? undefined
      : /'(\w+)',\{[^{}]*?id:'_id_nuevo'/.exec(html.slice(table))?.[1]
  if (!uuid) throw new Error('AEAT: the 036 successor table was not found')
  return uuid
}
