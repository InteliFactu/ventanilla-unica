import type { AeatExpedienteAct } from '../types/AeatExpedienteAct'
import { parseExpedienteAct } from './parseExpedienteAct'

/** Dated links under Historia del Expediente; links are listed, never opened. */
export const parseExpedienteActs = (
  html: string,
): readonly AeatExpedienteAct[] => {
  const history =
    /<h2[^>]*>Historia del Expediente<\/h2>([\s\S]*?)(?:<h2\b|<\/main>)/i.exec(
      html,
    )?.[1] ?? ''
  const acts: AeatExpedienteAct[] = []
  for (const [, item = ''] of history.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const act = parseExpedienteAct(item)
    if (act) acts.push(act)
  }
  return acts
}
