/** A `--primer-aviso`/`--segundo-aviso` value as a whole number of days. */
export const readDayCount = (
  text: string | undefined,
  name: string,
): number => {
  if (!text || !/^\d+$/.test(text))
    throw new Error(`--${name} is required, as a whole number of days`)
  return Number(text)
}
