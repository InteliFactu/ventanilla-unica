/** Only pages 2 and 5 can be repeated, marked as complementary. */
export const validateModel303PageCount = (
  tag: string,
  text: string,
  count: number,
): readonly string[] => {
  if (tag !== '02000' && tag !== '05000')
    return count === 1 ? [] : ['unexpected repeated page']
  if (tag === '02000' && count > 3)
    return ['at most three pages of type 02000 are permitted']
  return text.charAt(11) === (count === 1 ? ' ' : 'C')
    ? []
    : ['position 12: incorrect complementary-page marker']
}
