import { unescapeZkLabel } from '../../filings/mappers/unescapeZkLabel'
import { draftNoticeKind } from '../mappers/draftNoticeKind'
import type { DraftNotice } from '../types/DraftNotice'

/**
 * The "Errores y avisos" rows of an import answer: each `lineasTablaErrores`
 * row carries an icon tooltip, then three labels (line, code, description).
 */
export const parseDraftNotices = (answer: string): DraftNotice[] =>
  answer
    .split("zclass:'lineasTablaErrores'")
    .slice(1)
    .flatMap((row) => {
      const tooltip = /tooltiptext:'([^']+)'/.exec(row)?.[1] ?? ''
      const values = [
        ...row.matchAll(/Label','\w+',\{[^}]*?value:'((?:[^'\\]|\\.)*)'/g),
      ].map((match) => unescapeZkLabel(match[1] ?? '').replaceAll('\\"', '"'))
      const [line, code, description] = values
      if (line === undefined || code === undefined || description === undefined)
        return []
      return [{ kind: draftNoticeKind(tooltip), line, code, description }]
    })
