import { describe, expect, it } from 'vitest'

import type { ActivitiesRequest } from '../types/ActivitiesRequest'
import { activitiesProblems } from './activitiesProblems'

const request: ActivitiesRequest = {
  nif: '00000000T',
  actividades: [
    {
      tipo: 'A05',
      seccion: '2',
      epigrafe: '763',
      descripcion: 'Programadores y Analistas de Informática',
    },
  ],
  fecha: '02/11/2026',
  provincia: 'CACERES',
  municipio: 'CÁCERES',
  lugar: 'CACERES',
  firmado: 'GARCIA ANA',
  calidad: 'Interesado',
  validate: false,
  confirm: false,
}

describe('activitiesProblems', () => {
  it('accepts a complete request', () => {
    expect(activitiesProblems(request)).toEqual([])
  })

  it('names every invalid option', () => {
    const problems = activitiesProblems({
      ...request,
      fecha: '2026-11-02',
      municipio: '',
      actividades: [
        { tipo: 'X', seccion: '4', epigrafe: '7', descripcion: '' },
      ],
    })
    expect(problems).toHaveLength(6)
    expect(problems.join('\n')).toContain('--fecha')
    expect(problems.join('\n')).toContain('--actividades entry 1')
  })

  it('needs at least one activity', () => {
    expect(activitiesProblems({ ...request, actividades: [] })).toEqual([
      '--actividades is required.',
    ])
  })
})
