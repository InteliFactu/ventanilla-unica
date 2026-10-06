import { describe, expect, it } from 'vitest'

import { carpetaListPage } from '../fixtures/carpetaListPage'
import { parseNotificationRows } from './parseNotificationRows'

describe('parseNotificationRows', () => {
  it('keys each row by the column titles and pairs it with its link', () => {
    const html = carpetaListPage([
      { number: 'NOT-0001', status: 'Pendiente', link: 'j_id20' },
      { number: 'NOT-0002', status: 'Notificado' },
    ])
    const headers = [
      'Nº. expediente',
      'Trámite',
      'Nº. notificación',
      'Asunto',
      'F. notificación',
      'Estado',
      'Acciones',
    ]
    expect(
      parseNotificationRows(html, { id: 'f:tablaNotificaciones', headers }),
    ).toEqual([
      {
        record: {
          expediente: '',
          procedure: 'Tramite de prueba',
          notification: 'NOT-0001',
          subject: 'Asunto de prueba',
          notifiedOn: '01/02/2026',
          status: 'Pendiente',
        },
        link: 'f:tablaNotificaciones:0:j_id20',
      },
      expect.objectContaining({ link: undefined }),
    ])
  })
})
