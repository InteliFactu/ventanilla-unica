import type { RayuelaSession } from '../types/RayuelaSession'
/** Resolve page codes and menu identifiers from the live menu, never constants. */
export const parseRayuelaPageUrl = (
  html: string,
  name: string,
  session: RayuelaSession,
): string => {
  const codes = new Map(
    Array.from(html.matchAll(/var\s+c_(\w+)\s*=\s*(\d+)/g), (match) => [
      match[1],
      match[2],
    ]),
  )
  const menus = new Map(
    Array.from(
      html.matchAll(/accion\s*=\s*["']\('([^']+)'\s*,\s*'([^']+)'/g),
      (match) => [match[1], match[2]],
    ),
  )
  const code = codes.get(name)
  const menu = menus.get(name)
  if (!code || !menu) throw new Error(`Rayuela menu page not found: ${name}`)
  const params = new URLSearchParams({
    COD_PAGINA: code,
    X_MENU: menu,
    X_MENU_LLAMADA: menu,
    DESDE_MENU_: 'S',
    PRIMERA_VISITA_: 'S',
    N_V_: session.window,
  })
  return `https://rayuela.educarex.es/segedu/jsp/Principal.jsp?${params.toString()}`
}
