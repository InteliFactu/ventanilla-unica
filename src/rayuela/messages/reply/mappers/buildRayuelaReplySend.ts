import type { RayuelaReplySendInput } from '../types/RayuelaReplySendInput'
/**
 * The `PROCESA` parameters of the template's `enviarNuevoMensaje` for a single
 * reply. The empty `destinatarios` lists are what the portal sends too: a
 * reply is addressed by `X_MENUSU_RES` and `X_USUARIO_DESTINATARIO`.
 */
export const buildRayuelaReplySend = (
  input: RayuelaReplySendInput,
): Record<string, unknown> => ({
  MODO: 'RESPONDER_INDIVIDUAL',
  L_NOTINM: 'N',
  T_ASUNTO: input.form['tAsunto'],
  T_MENSAJE: input.html,
  CONFIG_ENVIO: {
    destinatarios: {
      listaColectivosEnviar_PARA: [],
      listaDestinatariosEnviar_PARA: [],
      datosColectivoCompletoEnviar_PARA: {},
      listaColectivosEnviar_CC: [],
      listaDestinatariosEnviar_CC: [],
      datosColectivoCompletoEnviar_CC: {},
      listaColectivosEnviar_CCO: [],
      listaDestinatariosEnviar_CCO: [],
      datosColectivoCompletoEnviar_CCO: {},
    },
    permiteCC: input.form['permiteCC'],
    permiteCCO: input.form['permiteCCO'],
    permiteNOTINM: input.form['permiteNOTINM'],
    X_MENUSU_RES: input.form['X_MENUSU_RES'],
    X_USUARIO_DESTINATARIO: input.recipientId,
    F_PROGRAMADA: '',
    L_ENVIO_INDIVIDUAL: 'S',
    permiteDe: 'N',
    datosDeConfigurable: input.form['datosDeConfigurable'],
  },
})
