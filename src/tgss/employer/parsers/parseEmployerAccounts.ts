import { readXmlField } from '../../prosa/parsers/readXmlField'
import type { EmployerAccount } from '../types/EmployerAccount'

/** Every `<ccc>` row of the RETC0001 `listaAutorizados` block. */
export const parseEmployerAccounts = (
  xml: string,
): readonly EmployerAccount[] =>
  [...xml.matchAll(/<ccc>([\s\S]*?)<\/ccc>/g)].map((match) => {
    const row = match[1] ?? ''
    const field = (tag: string): string => readXmlField(row, tag) ?? ''
    return {
      ccc: [field('CC2reg'), field('CC3pro'), field('CC4cod')].join(' '),
      tipo: field('tip'),
      situacion: field('sit'),
      fechaSituacion: field('fecSit'),
      razonSocial: field('RAZrazSoc'),
      autorizacionRed: field('SRAnumAut'),
    }
  })
