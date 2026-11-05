import { describe, expect, it } from 'vitest'

import { appointmentClient } from './fixtures/appointmentClient'
import { runAppointmentCommand } from './runAppointmentCommand'

const holder = {
  nif: '00000000T',
  nombre: 'TEST HOLDER',
  postal: '10000',
  fecha: '2026-10-23',
  hora: '11:30',
}

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
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('refuses confirmed booking without contact details before any portal request', async () => {
    const client = appointmentClient()
    await expect(
      runAppointmentCommand(client, {
        ...holder,
        centro: '99001',
        confirmar: 'si',
        out: '/nonexistent',
        telefono: '600000000',
      }),
    ).rejects.toThrow('valid contact')
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('plans an exact slot from the offer list without preselecting it', async () => {
    const client = appointmentClient()
    const result = await runAppointmentCommand(client, {
      ...holder,
      centro: '99001',
    })
    expect(result).toMatchObject({
      executed: false,
      slot: { centre: '99001', start: '1130' },
    })
    expect(client.request.mock.calls).toHaveLength(4)
    expect(
      client.request.mock.calls.some(
        ([, init]) => init?.form?.['fhora'] !== undefined,
      ),
    ).toBe(false)
  })
})
