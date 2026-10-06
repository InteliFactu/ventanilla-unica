import { htmlToText } from '../../../html/htmlToText'

/**
 * The error the registry shows in its alert block, or undefined. It is how it
 * refuses a CSV ("usted no es el interesado del documento introducido"), a
 * missing field or a closed procedure, always with a 200.
 */
export const readFilingAlert = (html: string): string | undefined => {
  const block = /<div id='idDivAlertas'[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1]
  const fromBlock = block === undefined ? '' : htmlToText(block)
  if (fromBlock) return fromBlock.replace(/\s*\(\s*Ir a error\s*\)\s*$/, '')
  const inline = /([^>]{10,400}?)\s*<a[^>]*>\s*\(\s*Ir a error\s*\)/.exec(html)
  return inline?.[1] === undefined ? undefined : htmlToText(inline[1])
}
