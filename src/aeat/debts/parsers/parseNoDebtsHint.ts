import { htmlToText } from '../../../html/htmlToText'

/** The page's own explanation when 'Relación de deudas' has no rows, kept verbatim. */
export const parseNoDebtsHint = (html: string): string | undefined => {
  const text = htmlToText(html)
  return /\bAvisos (No existen deudas para mostrar\.?)(?: Agencia Tributaria|$)/i.exec(
    text,
  )?.[1]
}
