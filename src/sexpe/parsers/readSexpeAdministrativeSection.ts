import { htmlToText } from '../../html/htmlToText'
import { normalizeLabel } from '../../html/mappers/normalizeLabel'

/** Identify the actual status section of an SNE demand result. */
export const readSexpeAdministrativeSection = (html: string): string => {
  const active = html.replaceAll(
    /<!--[\s\S]*?-->|<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
    '',
  )
  const title = /<title\b[^>]*>([^<]*)<\/title\s*>/i.exec(active)?.[1] ?? ''
  const groups = [
    ...active.matchAll(/<fieldset\b[^>]*>([\s\S]*?)<\/fieldset\s*>/gi),
  ]
  const sections = groups
    .map((group) => group[1] ?? '')
    .filter((section) => {
      const legend =
        /^\s*<legend\b[^>]*>([\s\S]*?)<\/legend\s*>/i.exec(section)?.[1] ?? ''
      return normalizeLabel(htmlToText(legend)) === 'SITUACION ADMINISTRATIVA'
    })
  const section = sections[0]
  if (
    !normalizeLabel(htmlToText(title)).includes('CONSULTA DE DEMANDA') ||
    sections.length !== 1 ||
    section === undefined
  )
    throw new Error(
      'SEXPE: the capture does not contain an unambiguous administrative status section',
    )
  return section
}
