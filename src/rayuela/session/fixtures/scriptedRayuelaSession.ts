import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { ScriptedClientExtras } from '../../../http/types/ScriptedClientExtras'

/** A synthetic password login followed by the supplied portal pages. */
export const scriptedRayuelaSession = (
  ...pages: string[]
): HttpClient & ScriptedClientExtras => {
  const portal = 'https://rayuela.educarex.es'
  const login = portal + '/modulo_acceso/'
  return scriptedClient(
    htmlResponse(
      login,
      `<form name="formulario" action="controlador.rayuela;jsessionid=fake"></form>`,
    ),
    htmlResponse(login, 'preparar-acceso-aplicacion SEGUIMIENTO_EDUCATIVO'),
    htmlResponse(
      login,
      `<input value='https://rayuela.educarex.es/segedu/jsp/EntradaDirectaUsuario.jsp?token=fake'>`,
    ),
    htmlResponse(
      portal,
      '\n\n' +
        JSON.stringify({
          nombreVentana: 'w1',
          menu: 'Menu.jsp',
          barraNavegacion: 'Barra.jsp',
        }),
    ),
    ...pages.map((page) => htmlResponse(portal, page)),
  )
}
