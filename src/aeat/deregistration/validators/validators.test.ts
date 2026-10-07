import { describe, expect, it } from 'vitest'

import type { DeregistrationRequest } from '../types/DeregistrationRequest'
import { deregistrationProblems } from './deregistrationProblems'

const request: DeregistrationRequest = {
  nif: 'E00000000',
  causa: 'disolucion',
  fecha: '31/10/2026',
  sucesores: [
    { nif: '11111111H', nombre: 'GARCIA ANA', porcentaje: '50', cuota: '0,00' },
  ],
  lugar: 'Madrid',
  firmado: 'GARCIA ANA',
  calidad: 'Representante',
  validate: false,
  confirm: false,
}

describe('deregistrationProblems', () => {
  it('accepts a complete request', () => {
    expect(deregistrationProblems(request)).toEqual([])
  })

  it('lists every problem', () => {
    const problems = deregistrationProblems({
      ...request,
      nif: '12345678Z',
      fecha: '2026-10-31',
      sucesores: [{ nif: 'X', nombre: '', porcentaje: 'half', cuota: '1.000' }],
      lugar: '',
      firmado: '',
      calidad: '',
    })
    expect(problems).toHaveLength(9)
  })

  it('asks for sucesores on a disolucion', () => {
    expect(deregistrationProblems({ ...request, sucesores: [] })).toEqual([
      expect.stringContaining('--sucesores'),
    ])
    expect(
      deregistrationProblems({ ...request, causa: 'otras', sucesores: [] }),
    ).toEqual([])
  })
})
