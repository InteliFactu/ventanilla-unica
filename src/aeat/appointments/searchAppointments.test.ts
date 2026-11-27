import { describe, expect, it } from 'vitest'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { fetchAppointmentPage } from './fetchers/fetchAppointmentPage'
import { appointmentClient } from './fixtures/appointmentClient'
import { appointmentErrorPage } from './fixtures/appointmentErrorPage'
import { appointmentQuery } from './fixtures/appointmentQuery'
import { appointmentResponse } from './fixtures/appointmentResponse'
import { refusingAppointmentClient } from './fixtures/refusingAppointmentClient'
import { listAppointments } from './listAppointments'
import { parseAppointmentSlots } from './parsers/parseAppointmentSlots'
import { readAppointmentErrorId } from './parsers/readAppointmentErrorId'
import { runAppointmentCommand } from './runAppointmentCommand'
import { searchAppointments } from './searchAppointments'

const manageUrl =
  'https://www2.agenciatributaria.gob.es/wlpl/TOCP-MUTE/internet/gestioncita'

describe('searchAppointments', () => {
  it('reports the procedimiento error page with the management link and skips the search', async () => {
    const client = refusingAppointmentClient('procedimiento')
    const result = await searchAppointments(client, appointmentQuery)
    expect(result).toMatchObject({
      slots: [],
      refusal: { errorId: '123456789', manageUrl },
    })
    expect(client.request.mock.calls).toHaveLength(3)
  })
  it('reports the error page at the cita step with HTTP 200 as well', async () => {
    const result = await searchAppointments(
      refusingAppointmentClient('cita', 200),
      appointmentQuery,
    )
    expect(result.refusal?.reason).toContain('already had an appointment')
  })
  it('does not report a transport refusal as an ordinary search result', async () => {
    await expect(
      searchAppointments(
        refusingAppointmentClient('cita', 403),
        appointmentQuery,
      ),
    ).rejects.toThrow('appointment session or page unavailable')
  })
  it('reads an incident number with entities and nested markup', () => {
    expect(
      readAppointmentErrorId('Identificaci&oacute;n del error: <b>123</b>'),
    ).toBe('123')
  })
  it('keeps listing offers when the portal answers normally', async () => {
    const result = await searchAppointments(
      appointmentClient(),
      appointmentQuery,
    )
    expect(result.slots).toHaveLength(1)
    expect(result.refusal).toBeUndefined()
  })
  it('makes listAppointments fail with the management link', async () => {
    await expect(
      listAppointments(
        refusingAppointmentClient('procedimiento'),
        appointmentQuery,
      ),
    ).rejects.toThrow(manageUrl)
  })
  it('reports the refusal from the CLI command instead of failing', async () => {
    await expect(
      runAppointmentCommand(refusingAppointmentClient('procedimiento'), {
        nif: '00000000T',
        nombre: 'TEST HOLDER',
        postal: '10000',
        fecha: '2026-10-23',
        hora: '11:30',
        centro: '99001',
      }),
    ).resolves.toMatchObject({
      executed: false,
      slots: [],
      refusal: { manageUrl },
    })
  })
  it('names the error page outside a search instead of calling it unavailable', async () => {
    const client = scriptedClient(
      appointmentResponse(appointmentErrorPage, 299),
    )
    await expect(fetchAppointmentPage(client, 'confirmacion')).rejects.toThrow(
      'step confirmacion answered its internal error page (error 123456789)',
    )
  })
  it('points an unrecognized search answer at the management page', () => {
    expect(() => parseAppointmentSlots('TOCP-MUTE other page')).toThrow(
      manageUrl,
    )
  })
})
