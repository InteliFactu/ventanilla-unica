import { describe, expect, it } from 'vitest'

import { flattenDocumentTree } from './flattenDocumentTree'

describe('flattenDocumentTree', () => {
  it('lists folder documents and the notifications nested under them, in order', () => {
    const documents = flattenDocumentTree([
      {
        id: '0',
        title: 'MON 1/2026',
        isFolder: true,
        children: [
          {
            id: 'F',
            title: 'DEMANDA',
            isFolder: true,
            children: [
              {
                id: 'a-1',
                title: '1. Demanda',
                numeroOrden: '1',
                tipo: 'DEM - DEMANDA',
                codigoBarras: 'D100   ',
                fechaAcontecimiento: Date.UTC(2026, 4, 4),
                children: [
                  {
                    id: 'a-2',
                    title: '2. Notificación',
                    numeroOrden: '2',
                    accesible: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ])

    expect(
      documents.map((document) => [document.id, document.carpeta]),
    ).toEqual([
      ['a-1', 'DEMANDA'],
      ['a-2', 'DEMANDA'],
    ])
    expect(documents[0]).toMatchObject({
      numero: '1',
      fecha: '2026-05-04',
      codigoBarras: 'D100',
      accesible: true,
    })
    expect(documents[1]?.accesible).toBe(false)
  })
})
