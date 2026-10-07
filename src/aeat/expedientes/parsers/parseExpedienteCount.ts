/** The portal's declared root-list count, used to reject a truncated table. */
export const parseExpedienteCount = (html: string): number => {
  const count = /<span[^>]*>\s*(\d+)\s+expedientes?\b/i.exec(html)?.[1]
  if (count === undefined)
    throw new Error('AEAT: expediente count was not returned')
  return Number(count)
}
