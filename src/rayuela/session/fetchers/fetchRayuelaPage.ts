import type { HttpClient } from '../../../http/types/HttpClient'
import { openRayuelaSession } from '../openRayuelaSession'
import { parseRayuelaChildrenChoices } from '../parsers/parseRayuelaChildrenChoices'
import { parseRayuelaPageUrl } from '../parsers/parseRayuelaPageUrl'
import { selectRayuelaChild } from '../selectors/selectRayuelaChild'
import { fetchRayuelaResponse } from './fetchRayuelaResponse'
/** Fetch a menu page; child switching changes only the session selection. */
export const fetchRayuelaPage = async (
  client: HttpClient,
  name: string,
  child?: string,
): Promise<string> => {
  const session = await openRayuelaSession(client)
  const menu = await fetchRayuelaResponse(client, session.menu)
  const url = parseRayuelaPageUrl(menu.text, name, session)
  if (child !== undefined) {
    const navigation = await fetchRayuelaResponse(client, session.navigation)
    const selected = selectRayuelaChild(
      parseRayuelaChildrenChoices(navigation.text),
      child,
    )
    await fetchRayuelaResponse(
      client,
      `https://rayuela.educarex.es/segedu/jsp/cambiaAlumnoDirecto.jsp?alumnoSalto=${encodeURIComponent(selected.id)}`,
    )
  }
  return (await fetchRayuelaResponse(client, url)).text
}
