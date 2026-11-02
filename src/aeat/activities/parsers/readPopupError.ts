import { unescapeJsString } from '../../taxAddress/mappers/unescapeJsString'

/** The text a 036 popup shows in its error box `errorId` after "Guardar", if any. */
export const readPopupError = (
  answer: string,
  errorId: string,
): string | undefined => {
  if (!answer.includes(errorId)) return undefined
  const texts = [...answer.matchAll(/value:'((?:[^'\\]|\\.)+)'/g)]
    .map(([, text = '']) => unescapeJsString(text).trim())
    .filter((text) => text !== '')
  return texts.join(' ') || 'the popup did not close'
}
