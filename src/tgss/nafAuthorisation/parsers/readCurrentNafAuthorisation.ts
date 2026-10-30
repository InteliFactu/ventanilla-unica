import { readXmlField } from '../../prosa/parsers/readXmlField'

/** The authorisation RETC0002 shows in its `cccPri` block: the one the holder's NAF is assigned to now. */
export const readCurrentNafAuthorisation = (xml: string): string => {
  const block = /<cccPri[^>]*>([\s\S]*?)<\/cccPri>/.exec(xml)?.[1] ?? ''
  return (readXmlField(block, 'SRAnumAut') ?? '').trim()
}
