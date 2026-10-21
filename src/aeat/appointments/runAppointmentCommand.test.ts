import { describe, expect, it } from 'vitest'

import { appointmentClient } from './fixtures/appointmentClient'
import { runAppointmentCommand } from './runAppointmentCommand'

describe('runAppointmentCommand', () => {
  it('lists offers without a reservation or a certificate', async () => {
    const client = appointmentClient()
    const result = await runAppointmentCommand(client, {
      nif: '00000000T',
      nombre: 'TEST HOLDER',
      postal: '10000',
      fecha: '2026-10-23',
      hora: '11:30',
    })
    expect(result).toMatchObject({
      executed: false,
      slots: [{ centre: '99001' }],
    })
    expect(client.request.mock.calls).toHaveLength(4)
  })
  it('refuses confirmed booking without a private receipt destination', async () => {
    const client = appointmentClient()
    await expect(
      runAppointmentCommand(client, {
        nif: '00000000T',
        nombre: 'TEST HOLDER',
        postal: '10000',
        fecha: '2026-10-23',
        hora: '11:30',
        centro: '99001',
        confirmar: 'si',
      }),
    ).rejects.toThrow('--out is required')
    expect(client.request.mock.calls).toHaveLength(4)
  })
})
