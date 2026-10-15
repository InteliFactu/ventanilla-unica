/**
 * A date in local time by an AutoFirma `$$SIGNDATE=<pattern>$$` pattern,
 * reading `yyyy`, `MM`, `dd`, `HH`, `mm` and `ss`; other text stays as is.
 */
export const formatSignDate = (date: Date, pattern: string): string => {
  const two = (value: number): string => String(value).padStart(2, '0')
  const parts: Readonly<Record<string, string>> = {
    yyyy: String(date.getFullYear()),
    MM: two(date.getMonth() + 1),
    dd: two(date.getDate()),
    HH: two(date.getHours()),
    mm: two(date.getMinutes()),
    ss: two(date.getSeconds()),
  }
  return pattern.replace(
    /yyyy|MM|dd|HH|mm|ss/g,
    (token) => parts[token] ?? token,
  )
}
