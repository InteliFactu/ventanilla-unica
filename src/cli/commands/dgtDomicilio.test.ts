import { describe, expect, it, vi } from 'vitest'

import { planDgtAddressChange } from '../../dgt/address/planDgtAddressChange'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { dgtDomicilio } from './dgtDomicilio'

vi.mock('../../dgt/address/planDgtAddressChange')

describe('dgt domicilio', () => {
  it('passes --confirmar si through and is marked as a write', async () => {
    const client = scriptedClient()
    await dgtDomicilio.run(client, {
      nif: '12345678Z',
      'tipo-via': 'CALLE',
      via: 'MAYOR',
      numero: '7',
      'codigo-postal': '28001',
      municipio: 'MADRID',
      provincia: 'MADRID',
      confirmar: 'si',
    })
    expect(planDgtAddressChange).toHaveBeenCalledWith(
      client,
      expect.objectContaining({ nif: '12345678Z', cp: '28001' }),
      true,
    )
    expect(dgtDomicilio.effect).toBe('write')
  })
})
