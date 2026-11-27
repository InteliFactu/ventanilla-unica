/** Parse the inbox's DD/MM/YYYY labels as exact calendar dates. */
export const resolveRayuelaExplicitDateMs = (
  label: string,
): number | undefined => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(label)) return undefined
  const [day = '', month = '', year = ''] = label.split('/')
  const iso = `${year}-${month}-${day}`
  const date = new Date(`${iso}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString().startsWith(`${iso}T`) ? date.getTime() : undefined
}
