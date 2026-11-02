import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { openM036Form } from '../taxAddress/openM036Form'
import { pressM036Validation } from '../taxAddress/pressM036Validation'
import { submitM036 } from '../taxAddress/submitM036'
import { fillActivities } from './fillActivities'
import { registerActivities } from './registerActivities'
import type { ActivitiesRequest } from './types/ActivitiesRequest'

vi.mock('../session/openAeatSession', () => ({ openAeatSession: vi.fn() }))
vi.mock('../taxAddress/openM036Form', () => ({ openM036Form: vi.fn() }))
vi.mock('../taxAddress/pressM036Validation', () => ({
  pressM036Validation: vi.fn(),
}))
vi.mock('../taxAddress/submitM036', () => ({ submitM036: vi.fn() }))
vi.mock('./fillActivities', () => ({ fillActivities: vi.fn() }))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
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

describe('registerActivities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(submitM036).mockResolvedValue({ labels: ['ok'], urls: [] })
  })

  it('plans offline without a request', async () => {
    const result = await registerActivities(client, request)
    expect(result.executed).toBe(false)
    expect(result.plan.join('\n')).toContain('casilla 127')
    expect(result.plan.join('\n')).toContain('epígrafe 763')
    expect(openAeatSession).not.toHaveBeenCalled()
  })

  it('refuses invalid options even when confirmed', async () => {
    const result = await registerActivities(client, {
      ...request,
      fecha: 'mañana',
      confirm: true,
    })
    expect(result.executed).toBe(false)
    expect(openAeatSession).not.toHaveBeenCalled()
  })

  it('validates at the AEAT without filing', async () => {
    const result = await registerActivities(client, {
      ...request,
      validate: true,
    })
    expect(fillActivities).toHaveBeenCalledOnce()
    expect(pressM036Validation).toHaveBeenCalledOnce()
    expect(submitM036).not.toHaveBeenCalled()
    expect(result.executed).toBe(false)
  })

  it('files only when confirmed', async () => {
    const result = await registerActivities(client, {
      ...request,
      confirm: true,
    })
    expect(openM036Form).toHaveBeenCalledWith(client, '00000000T')
    expect(submitM036).toHaveBeenCalledOnce()
    expect(result.executed).toBe(true)
  })
})
