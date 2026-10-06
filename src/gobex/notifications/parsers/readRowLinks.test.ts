import { describe, expect, it } from 'vitest'

import { carpetaRowsTable } from '../fixtures/carpetaRowsTable'
import { readRowLinks } from './readRowLinks'

describe('readRowLinks', () => {
  it('reads the jsfcljs parameter of each row, offset rows included', () => {
    const html = carpetaRowsTable(
      [
        { number: 'A', status: 'Notificado', link: 'j_id3' },
        { number: 'B', status: 'Expirado' },
      ],
      8,
    )
    expect(readRowLinks(html, 'f:tablaNotificaciones')).toEqual([
      'f:tablaNotificaciones:8:j_id3',
      undefined,
    ])
  })

  it('answers nothing for a missing table', () => {
    expect(readRowLinks('<p/>', 'f:x')).toEqual([])
  })
})
