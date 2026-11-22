/** The uuid of the ZK widget with id `widgetId` (036, 303 forms), from the newest answer that declares it. */
export const findWidgetUuid = (
  blobs: readonly string[],
  widgetId: string,
): string => {
  const declaration = `',{id:'${widgetId}'`
  for (const blob of [...blobs].reverse()) {
    const at = blob.indexOf(declaration)
    if (at < 0) continue
    const uuid = /'(\w+)$/.exec(blob.slice(Math.max(0, at - 64), at))?.[1]
    if (uuid) return uuid
  }
  throw new Error(`AEAT: widget ${widgetId} not found`)
}
