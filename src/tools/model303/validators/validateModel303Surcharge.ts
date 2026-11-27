/** Casilla 169 is 0.50%, with the DP30301 note 7 Foral exception. */
export const validateModel303Surcharge = (
  text: string,
  year: string,
): readonly string[] => {
  const position = year === '2025' ? 1013 : 523
  const value = text.slice(position - 1, position + 4)
  return value === '00050' || (text.charAt(108) === '1' && value === '00000')
    ? []
    : [
        `box 169 at position ${String(position)}: expected 00050 except for exclusively Foral declarations`,
      ]
}
