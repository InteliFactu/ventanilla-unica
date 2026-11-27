import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { appointmentClient } from './fixtures/appointmentClient'
import { appointmentConfirmedReceipt } from './fixtures/appointmentConfirmedReceipt'
import { appointmentErrorPage } from './fixtures/appointmentErrorPage'
import { appointmentResponse } from './fixtures/appointmentResponse'
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

  it.each([
    [appointmentConfirmedReceipt, 200, true],
    [appointmentConfirmedReceipt, 299, false],
    [appointmentConfirmedReceipt.replace('00000000T', '99999999R'), 200, false],
    [appointmentConfirmedReceipt.replace('11:30', '12:00'), 200, false],
    [
      appointmentConfirmedReceipt.replace('Test City', 'Test City County'),
      200,
      false,
    ],
    [appointmentConfirmedReceipt.replace('</h2>', '</h2></div>'), 200, false],
    [`<template>${appointmentConfirmedReceipt}</template>`, 200, false],
    [`<section hidden>${appointmentConfirmedReceipt}</section>`, 200, false],
    [appointmentErrorPage, 299, false],
  ])(
    'preserves the response and only confirms the requested appointment',
    async (body, status, confirmed) => {
      const receipt = appointmentResponse(body, status, 'confirmacion')
      const client = appointmentClient(undefined, undefined, receipt, true)
      const out = await mkdtemp(join(tmpdir(), 'aeat-appointment-'))
      const result = await runAppointmentCommand(client, {
        ...holder,
        centro: '99001',
        confirmar: 'si',
        email: 'holder@example.test',
        telefono: '600000000',
        out,
      })
      expect(result).toMatchObject({
        executed: true,
        confirmed,
      })
      expect(result).toHaveProperty('receiptPath', expect.stringContaining(out))
      expect(
        client.request.mock.calls.filter(([url]) =>
          url.endsWith('/confirmacion'),
        ),
      ).toHaveLength(1)
      expect(client.request.mock.calls.at(-1)?.[1]?.followRedirects).toBe(false)
    },
  )
})
