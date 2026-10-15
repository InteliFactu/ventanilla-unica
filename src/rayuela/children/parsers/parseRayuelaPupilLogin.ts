import { htmlToText } from '../../../html/htmlToText'
/** Displayed login only; never follow password generation controls. */
export const parseRayuelaPupilLogin = (html: string): string =>
  htmlToText(
    /<div\s[^>]*class=['"]tLogin['"][^>]*>([\s\S]*?)<\/div>/i.exec(html)?.[1] ??
      '',
  )
