/** Box 111 needs bank details unless page 3 requests a direct-debit change. */
export const validateModel303Rectification = (
  result: string,
  bank: string | undefined,
  year: string,
): readonly string[] => {
  const previousLayout = year === '2025'
  const box111 = previousLayout ? 424 : 441
  if (!/[1-9]/.test(result.slice(box111 - 1, box111 + 16))) return []
  if (result.charAt(previousLayout ? 391 : 425) !== 'X')
    return ['box 111 requires the rectification marker']
  if (result.charAt(previousLayout ? 405 : 439) === 'X') return []
  return bank?.slice(22, 56).trim() && /^[1-3]$/.test(bank.charAt(193))
    ? []
    : ['box 111 requires bank details on page DID00']
}
