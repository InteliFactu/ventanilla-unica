import type { HttpClient } from '../../http/types/HttpClient'
import { parseGateButtons } from './parsers/parseGateButtons'
import { selectGateStep } from './selectors/selectGateStep'
import { staContactBody } from './staContactBody'
import type { StaContactQuery } from './types/StaContactQuery'
import type { StaGatePage } from './types/StaGatePage'

/**
 * Walk the gate from the page `html`: press its next confirming button, then
 * the next one the answer offers, until none is left. Returns the actions
 * pressed. Capped, so a gate that keeps asking cannot loop.
 */
export const answerContactGate = async (
  client: HttpClient,
  gate: StaGatePage,
  query: StaContactQuery,
): Promise<readonly string[]> => {
  const pressed: string[] = []
  let step = selectGateStep(parseGateButtons(gate.html))
  while (step !== undefined && pressed.length < 4) {
    pressed.push(step.action)
    const answer = await client.request(
      `${new URL(gate.url).origin}/sta/CarpetaPrivate/submitAjax.aa`,
      {
        method: 'POST',
        form: staContactBody(step, query),
        referer: gate.url,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      },
    )
    step = selectGateStep(parseGateButtons(answer.text))
  }
  return pressed
}
