import { describe, expect, it } from 'vitest'
import { parseAppointmentQuery } from './parseAppointmentQuery'

describe('parseAppointmentQuery', () => {
  it('requires explicit search bounds', () => {
    expect(() => parseAppointmentQuery({})).toThrow('Provide')
  })
  it('defaults to the offered deferral service', () => {
    expect(
      parseAppointmentQuery({
        nif: '00000000T',
        nombre: 'TEST',
        postal: '10000',
        fecha: '2026-10-23',
        hora: '11:30',
      }).service,
    ).toBe('C324163')
  })
  it('rejects impossible dates, injection in service codes and invalid hours', () => {
    const options = {
      nif: '00000000T',
      nombre: 'TEST',
      postal: '10000',
      fecha: '2026-02-30',
      hora: '11:30',
    }
    expect(() => parseAppointmentQuery(options)).toThrow('does not exist')
    expect(() =>
      parseAppointmentQuery({ ...options, fecha: '2026-10-23', servicio: "'" }),
    ).toThrow('Provide')
    expect(() =>
      parseAppointmentQuery({ ...options, fecha: '2026-10-23', hora: '25:00' }),
    ).toThrow('Provide')
  })
})
