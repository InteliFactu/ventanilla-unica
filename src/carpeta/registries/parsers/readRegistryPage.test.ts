import { describe, expect, it } from 'vitest'

import { registryEntryFixture } from '../fixtures/registryEntryFixture'
import { registryResponseFixture } from '../fixtures/registryResponseFixture'
import { readRegistryPage } from './readRegistryPage'

describe('readRegistryPage', () => {
  it('maps an entry with its latest state and parties', () => {
    const page = readRegistryPage(
      registryResponseFixture(
        [registryEntryFixture('REGAGE26e00000000001')],
        1,
      ),
    )
    expect(page).toMatchObject({ total: 1, warning: null })
    expect(page.entries[0]).toEqual({
      number: 'REGAGE26e00000000001',
      registeredAt: '2026-10-05T15:14:22.000+0000',
      office: 'Registro Electrónico de Ejemplo',
      exchangeCode: 'O00000001_26_REGAGE26e00000000001',
      state: 'Confirmado',
      annotations: [
        {
          code: '09',
          description: 'Confirmado',
          at: '2026-10-06T09:00:00.000+0000',
          observations: 'Aceptado en destino',
          office: 'Unidad de Ejemplo',
        },
        {
          code: '02',
          description: 'Enviado',
          at: '2026-10-05T15:14:30.000+0000',
          observations: null,
          office: null,
        },
      ],
      parties: [{ name: 'ANA PÉREZ', document: '00000000T' }],
    })
  })

  it('keeps a warning, refuses errors and non-JSON', () => {
    expect(
      readRegistryPage(registryResponseFixture([], 0, '1', 'Aviso')),
    ).toEqual({
      total: 0,
      entries: [],
      warning: 'Aviso',
    })
    expect(() =>
      readRegistryPage(registryResponseFixture([], 0, 2, 'Sin datos')),
    ).toThrow(
      /^Carpeta: consultaRegistros refused the query \(codRespuesta 2\)$/,
    )
    expect(() => readRegistryPage('{}')).toThrow('invalid response status')
    expect(() =>
      readRegistryPage(registryResponseFixture([], 0, null)),
    ).toThrow('invalid response status')
    expect(() => readRegistryPage(registryResponseFixture([], 0, ' '))).toThrow(
      'invalid response status',
    )
    expect(() => readRegistryPage('<html>')).toThrow('was not JSON')
    expect(() => readRegistryPage(registryResponseFixture([{}], 1))).toThrow(
      'no numRegistro',
    )
  })

  it('keeps unexpected refusal details out of errors', () => {
    expect(() =>
      readRegistryPage(
        registryResponseFixture(
          [],
          0,
          'Unexpected holder context',
          'Unrelated document 00000000T',
        ),
      ),
    ).toThrow(
      /^Carpeta: consultaRegistros returned an invalid response status$/,
    )
  })

  it.each([undefined, null, '', true, -1, 1.5, '3e5'])(
    'refuses the invalid total %s',
    (total) => {
      expect(() =>
        readRegistryPage(registryResponseFixture([], total)),
      ).toThrow('invalid result total')
    },
  )

  it('does not map a malformed row even when the array count is correct', () => {
    expect(() => readRegistryPage(registryResponseFixture([null], 1))).toThrow(
      'no numRegistro',
    )
  })
})
