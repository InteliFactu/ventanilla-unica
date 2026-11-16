import { expect, it } from 'vitest'
import { buildRayuelaReplySend } from './buildRayuelaReplySend'

it('addresses the reply by message and recipient with empty recipient lists', () => {
  const send = buildRayuelaReplySend({
    form: {
      tAsunto: 'RE: Tutoría',
      permiteCC: 'N',
      permiteCCO: 'N',
      permiteNOTINM: 'N',
      X_MENUSU_RES: '10',
      datosDeConfigurable: '-1_-NOM',
    },
    recipientId: '22031',
    html: '<p>Hola</p>',
  })
  expect(send).toMatchObject({
    MODO: 'RESPONDER_INDIVIDUAL',
    T_ASUNTO: 'RE: Tutoría',
    T_MENSAJE: '<p>Hola</p>',
    CONFIG_ENVIO: {
      X_MENUSU_RES: '10',
      X_USUARIO_DESTINATARIO: '22031',
      L_ENVIO_INDIVIDUAL: 'S',
      destinatarios: { listaDestinatariosEnviar_PARA: [] },
    },
  })
})
