/** Page 02000 is present exactly for regimes that include the simplified method. */
export const validateModel303RegimePage = (
  identification: string | undefined,
  hasSimplifiedPage: boolean,
): readonly string[] => {
  if (identification === undefined) return []
  const regime = identification.charAt(110)
  if (regime === '3')
    return hasSimplifiedPage ? ['general regime excludes page 02000'] : []
  if (regime === '1' || regime === '2')
    return hasSimplifiedPage ? [] : ['simplified regime requires page 02000']
  return ['position 111: invalid taxation regime']
}
