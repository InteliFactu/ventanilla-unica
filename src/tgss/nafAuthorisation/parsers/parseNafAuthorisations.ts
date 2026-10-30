import { readXmlField } from '../../prosa/parsers/readXmlField'
import type { NafRedAuthorisation } from '../types/NafRedAuthorisation'

/** Every `<enAutorizado>` row of the RETC0002 `listaAutorizados` block. */
export const parseNafAuthorisations = (
  xml: string,
): readonly NafRedAuthorisation[] =>
  [...xml.matchAll(/<enAutorizado>([\s\S]*?)<\/enAutorizado>/g)].map(
    (match) => {
      const row = match[1] ?? ''
      const field = (tag: string): string =>
        (readXmlField(row, tag) ?? '').trim()
      return {
        autorizacionRed: field('SRAnumAut'),
        razonSocial: field('RAZrazSoc'),
        desde: field('fecIniRel'),
        hasta: field('fecFinRel'),
      }
    },
  )
