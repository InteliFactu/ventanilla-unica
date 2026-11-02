/** The uuid of the first "Añadir registro" (`_id_nuevo`) button after `marker` in a 036 answer. */
export const findNewButtonAfter = (text: string, marker: string): string => {
  const at = text.indexOf(marker)
  const uuid =
    at < 0
      ? undefined
      : /'(\w+)',\{[^{}]*?id:'_id_nuevo'/.exec(text.slice(at))?.[1]
  if (!uuid)
    throw new Error(`AEAT: the 036 table after "${marker}" was not found`)
  return uuid
}
