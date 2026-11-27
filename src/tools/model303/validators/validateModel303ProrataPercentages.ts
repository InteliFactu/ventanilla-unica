/** Each of the five proration rates has two decimals and may not exceed 100%. */
export const validateModel303ProrataPercentages = (
  text: string,
  year: string,
): readonly string[] => {
  const extraCnaeByte = year === '2025' ? 0 : 1
  const problems: string[] = []
  for (let index = 0; index < 5; index += 1) {
    const start = 51 + extraCnaeByte + index * (43 + extraCnaeByte)
    if (Number(text.slice(start - 1, start + 4)) > 10_000)
      problems.push(
        `positions ${String(start)}-${String(start + 4)}: proration cannot exceed 100%`,
      )
  }
  return problems
}
