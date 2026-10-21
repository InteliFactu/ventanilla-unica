import { describe, expect, it } from 'vitest'
import { bookAppointment } from './bookAppointment'
import { appointmentClient } from './fixtures/appointmentClient'
import { appointmentQuery } from './fixtures/appointmentQuery'
import { appointmentSlot } from './fixtures/appointmentSlot'

describe('bookAppointment', () => {
  it('never sends final confirmation without the explicit flag', async () => {
    const client = appointmentClient()
    expect(
      await bookAppointment(client, appointmentQuery, {
        slot: appointmentSlot,
        email: '',
        phone: '',
        detail: '',
        confirm: false,
      }),
    ).toEqual({ executed: false })
    expect(client.request.mock.calls).toHaveLength(5)
    expect(
      client.request.mock.calls.some(([url]) => url.endsWith('/confirmacion')),
    ).toBe(false)
  })
  it('rejects a stale confirmation before the final reservation', async () => {
    const client = appointmentClient(
      undefined,
      'onSubmitConfirmaCita() femail1 Wrong holder and date',
    )
    await expect(
      bookAppointment(client, appointmentQuery, {
        slot: appointmentSlot,
        email: 'holder@example.test',
        phone: '600000000',
        detail: '',
        confirm: true,
      }),
    ).rejects.toThrow('does not match')
    expect(client.request.mock.calls).toHaveLength(5)
  })
  it('requires the exact currently offered centre and slot', async () => {
    const client = appointmentClient()
    await expect(
      bookAppointment(client, appointmentQuery, {
        slot: { ...appointmentSlot, centre: '99999' },
        email: '',
        phone: '',
        detail: '',
        confirm: true,
      }),
    ).rejects.toThrow('no longer offered')
    expect(client.request.mock.calls).toHaveLength(4)
  })
  it('requires contact details before confirming', async () => {
    const client = appointmentClient()
    await expect(
      bookAppointment(client, appointmentQuery, {
        slot: appointmentSlot,
        email: '',
        phone: '',
        detail: '',
        confirm: true,
      }),
    ).rejects.toThrow('valid contact')
    expect(client.request.mock.calls).toHaveLength(5)
  })
  it('submits once and reports transmission separately from receipt confirmation', async () => {
    const client = appointmentClient()
    const result = await bookAppointment(client, appointmentQuery, {
      slot: appointmentSlot,
      email: 'holder@example.test',
      phone: '600000000',
      detail: 'Review payment plan',
      confirm: true,
    })
    expect(result.executed).toBe(true)
    expect(result.html).toContain('Cita confirmada')
    expect(client.request.mock.calls).toHaveLength(6)
    expect(client.request.mock.calls.at(-1)?.[1]?.form).toMatchObject({
      faccion: 'V',
      ftel1: '600000000',
      femail1: 'holder@example.test',
    })
  })
})
