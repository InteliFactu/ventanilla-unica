import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpResponse } from '../../http/types/HttpResponse'

/** Synthetic pages of the order, after the plan pages: pago, procesando, two polls and pago-orden. */
export const registradoresOrderPages = (): HttpResponse[] => {
  const site = 'https://sede.registradores.org/site/'
  const csrf = '<input type="hidden" name="_csrf" value="csrf-1"/>'
  return [
    htmlResponse(
      `${site}certificado/solicitud/pago`,
      `<form id="formCheckout" action="/site/certificado/solicitud/pagar" method="post">${csrf}</form><h2>Resumen</h2><table><tr><th>Concepto</th><th>Cantidad/Coste</th></tr><tr><td>Nota informativa mercantil Registro Mercantil de Caceres. EJEMPLO ACTIVIDADES SL, B00000000.</td><td>3,58 &euro;</td></tr></table>`,
    ),
    htmlResponse(`${site}certificado/solicitud/pagar`, '<h1>Procesando</h1>'),
    htmlResponse(`${site}certificado/solicitud/orden-completa`, 'false'),
    htmlResponse(`${site}certificado/solicitud/orden-completa`, 'true'),
    htmlResponse(
      `${site}certificado/solicitud/pago-orden`,
      `<form action="https://payment.example.com/hostedcheckout/Payment/Form/abc123" method="post" id="redsys_form" name="redsys_form">${csrf}<input id="autoSubmitPay" type="submit" value="Enviar"/></form>`,
    ),
  ]
}
