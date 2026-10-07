import { unescapeJsString } from '../../taxAddress/mappers/unescapeJsString'

/** The text the successor popup shows in its error box after "Guardar", if any. */
export const readSuccessorError = (answer: string): string | undefined => {
  if (!answer.includes('errorSucesores')) return undefined
  const texts = [...answer.matchAll(/value:'((?:[^'\\]|\\.)+)'/g)]
    .map(([, text = '']) => unescapeJsString(text).trim())
    .filter((text) => text !== '')
  return texts.join(' ') || undefined
}
