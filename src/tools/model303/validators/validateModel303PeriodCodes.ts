import type { Model303Envelope } from '../types/Model303Envelope'

/** Identification flags constrained by DP30301 notes 3–6. */
export const validateModel303PeriodCodes = (
  text: string,
  { periodo }: Model303Envelope,
): readonly string[] => {
  const finalPeriod = periodo === '12' || periodo === '4T'
  const foral = text.charAt(108) === '1'
  const exemptAnnual = text.charAt(127) === '1'
  const specialProrata = !foral && finalPeriod ? '12' : '2'
  const codes: [number, string][] = [
    [115, specialProrata],
    [116, specialProrata],
    [128, foral ? '2' : finalPeriod ? '12' : '0'],
    [129, foral ? '2' : finalPeriod && exemptAnnual ? '12' : '0'],
  ]
  return codes.flatMap(([position, allowed]) =>
    allowed.includes(text.charAt(position - 1))
      ? []
      : [
          `position ${String(position)}: invalid code for the declaration period or regime`,
        ],
  )
}
