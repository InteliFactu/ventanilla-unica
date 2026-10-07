/**
 * The uuid of the ZK widget whose properties include `id:'<widgetId>'`, from
 * the newest answer that declares it. Unlike `findWidgetUuid` it tolerates
 * properties before the id (`{format:'dd/MM/yyyy',id:...}` on a Datebox).
 */
export const findDeclaredUuid = (
  blobs: readonly string[],
  widgetId: string,
): string => {
  for (const blob of [...blobs].reverse()) {
    const at = blob.indexOf(`id:'${widgetId}'`)
    const brace = at < 0 ? -1 : blob.lastIndexOf('{', at)
    if (brace < 0) continue
    const uuid = /'(\w+)',$/.exec(
      blob.slice(Math.max(0, brace - 64), brace),
    )?.[1]
    if (uuid) return uuid
  }
  throw new Error(`AEAT: 036 widget ${widgetId} not found`)
}
