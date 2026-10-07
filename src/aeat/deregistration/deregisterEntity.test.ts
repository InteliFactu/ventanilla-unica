import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { openM036Form } from '../taxAddress/openM036Form'
import { pressM036Validation } from '../taxAddress/pressM036Validation'
import { submitM036 } from '../taxAddress/submitM036'
import { deregisterEntity } from './deregisterEntity'
import { fillDeregistration } from './fillDeregistration'
import type { DeregistrationRequest } from './types/DeregistrationRequest'

vi.mock('../session/openAeatSession', () => ({ openAeatSession: vi.fn() }))
vi.mock('../taxAddress/openM036Form', () => ({ openM036Form: vi.fn() }))
vi.mock('../taxAddress/pressM036Validation', () => ({
  pressM036Validation: vi.fn(),
}))
vi.mock('../taxAddress/submitM036', () => ({ submitM036: vi.fn() }))
vi.mock('./fillDeregistration', () => ({ fillDeregistration: vi.fn() }))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
const request: DeregistrationRequest = {
  nif: 'E00000000',
  causa: 'otras',
  fecha: '31/10/2026',
  sucesores: [],
  lugar: 'Madrid',
  firmado: 'GARCIA ANA',
  calidad: 'Representante',
  validate: false,
  confirm: false,
}

describe('deregisterEntity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(submitM036).mockResolvedValue({ labels: ['ok'], urls: [] })
  })

  it('plans offline without a request', async () => {
    const result = await deregisterEntity(client, request)
    expect(result.executed).toBe(false)
    expect(result.plan.join('\n')).toContain('casilla 150')
    expect(openAeatSession).not.toHaveBeenCalled()
  })

  it('refuses invalid options even when confirmed', async () => {
    const result = await deregisterEntity(client, {
      ...request,
      fecha: 'mañana',
      confirm: true,
    })
    expect(result.executed).toBe(false)
    expect(openAeatSession).not.toHaveBeenCalled()
  })

  it('validates at the AEAT without filing', async () => {
    const result = await deregisterEntity(client, {
      ...request,
      validate: true,
    })
    expect(fillDeregistration).toHaveBeenCalledOnce()
    expect(pressM036Validation).toHaveBeenCalledOnce()
    expect(submitM036).not.toHaveBeenCalled()
    expect(result.notes[0]).toContain('nothing was filed')
  })

  it('files only when confirmed', async () => {
    const result = await deregisterEntity(client, { ...request, confirm: true })
    expect(openM036Form).toHaveBeenCalledWith(client, 'E00000000')
    expect(submitM036).toHaveBeenCalledOnce()
    expect(result).toMatchObject({
      executed: true,
      receipt: { labels: ['ok'] },
    })
  })
})
