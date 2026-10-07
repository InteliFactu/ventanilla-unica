/**
 * A DD/MM/YYYY date as ZK's client sends a Datebox value (`jq.d2j`: UTC
 * parts joined by dots, unpadded). Noon UTC keeps the same calendar day in
 * Spain, whatever the server's offset.
 */
export const zkDateValue = (date: string): string => {
  const [day = '', month = '', year = ''] = date.split('/')
  return [year, month, day, '12', '0', '0', '0']
    .map((part) => String(Number(part)))
    .join('.')
}
