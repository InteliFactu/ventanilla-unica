import { describe, expect, it } from 'vitest'
import { appointmentClient } from '../fixtures/appointmentClient'
import { appointmentQuery } from '../fixtures/appointmentQuery'
import { appointmentResponse } from '../fixtures/appointmentResponse'
import { fetchAppointmentOffers } from './fetchAppointmentOffers'
import { fetchAppointmentPage } from './fetchAppointmentPage'

describe('fetchAppointmentOffers', () => {
  it('keeps the search in person, bounded by the requested date/time and postal code', async () => {
    const client = appointmentClient()
    await fetchAppointmentOffers(client, appointmentQuery)
    expect(client.request.mock.calls.at(-1)?.[1]?.form).toMatchObject({
      filpre: 'S',
      filtel: 'N',
      fpropos: '10000',
      fDesde: '2026-10-23',
      hDesde: '11:29',
    })
  })
  it('rejects an unoffered service before selecting it', async () => {
    await expect(
      fetchAppointmentOffers(appointmentClient(), {
        ...appointmentQuery,
        service: 'C000000',
      }),
    ).rejects.toThrow('did not offer')
  })
  it('rejects HTTP failures and unexpected login pages', async () => {
    const client = appointmentClient()
    client.request
      .mockReset()
      .mockResolvedValueOnce(appointmentResponse('', 403))
    await expect(fetchAppointmentPage(client, 'cita')).rejects.toThrow(
      'unavailable',
    )
    client.request.mockResolvedValueOnce({
      ...appointmentResponse(''),
      text: 'Login',
    })
    await expect(fetchAppointmentPage(client, 'cita')).rejects.toThrow(
      'unavailable',
    )
  })
})
