/** A numeric header, or undefined when the call did not send it. */
export const optionalNumber = (
  value: string | undefined,
): number | undefined =>
  value === undefined || value === '' ? undefined : Number(value)
