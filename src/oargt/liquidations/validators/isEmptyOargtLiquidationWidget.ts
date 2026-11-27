import { readAgreementMarkupTags } from '../../../aeat/debts/parsers/readAgreementMarkupTags'
import { htmlToText } from '../../../html/htmlToText'
import { readAttribute } from '../../../html/readAttribute'

/** Require one visible information notice and reject markup with a competing list. */
export const isEmptyOargtLiquidationWidget = (
  markup: string,
  expectedNotice: string,
): boolean => {
  const openingTags = [...readAgreementMarkupTags(markup)].filter(
    ([, closing]) => !closing,
  )
  if (openingTags.some(([, , name = '']) => /^(?:table|tr)$/i.test(name)))
    return false
  const notices = openingTags.filter(
    ([tag, , name]) =>
      name?.toLowerCase() === 'div' &&
      (readAttribute(tag, 'class') ?? '').split(/\s+/).includes('Informativo'),
  )
  const [notice] = notices
  if (!notice || notices.length !== 1) return false
  const start = notice.index + notice[0].length
  const end = markup.indexOf('</div>', start)
  return (
    end !== -1 &&
    htmlToText(markup.slice(start, end)).replace(/\.$/, '') === expectedNotice
  )
}
