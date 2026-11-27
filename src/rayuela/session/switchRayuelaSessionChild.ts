import type { HttpClient } from '../../http/types/HttpClient'
import { parseRayuelaChildren } from '../children/parsers/parseRayuelaChildren'
import { fetchRayuelaResponse } from './fetchers/fetchRayuelaResponse'
import { fetchRayuelaSwitcherChoices } from './fetchers/fetchRayuelaSwitcherChoices'
import { mapRayuelaChildRoster } from './mappers/mapRayuelaChildRoster'
import { parseRayuelaPageUrl } from './parsers/parseRayuelaPageUrl'
import { resolveRayuelaChildSwitch } from './selectors/resolveRayuelaChildSwitch'
import type { RayuelaSession } from './types/RayuelaSession'
import { assertRayuelaChildSwitch } from './validators/assertRayuelaChildSwitch'

/** Select the requested child and confirm the session changed before reading its page. */
export const switchRayuelaSessionChild = async (
  client: HttpClient,
  session: RayuelaSession,
  menu: string,
  query: string,
): Promise<void> => {
  const choices = await fetchRayuelaSwitcherChoices(client, session)
  const rosterUrl = parseRayuelaPageUrl(menu, 'DetDatMisHij', session)
  const roster = await fetchRayuelaResponse(client, rosterUrl)
  const children = mapRayuelaChildRoster(parseRayuelaChildren(roster.text))
  const { nia, switchId } = resolveRayuelaChildSwitch(children, choices, query)
  if (switchId === undefined) return
  await fetchRayuelaResponse(
    client,
    `https://rayuela.educarex.es/segedu/jsp/cambiaAlumnoDirecto.jsp?alumnoSalto=${encodeURIComponent(switchId)}`,
  )
  assertRayuelaChildSwitch(
    children,
    await fetchRayuelaSwitcherChoices(client, session),
    nia,
  )
}
