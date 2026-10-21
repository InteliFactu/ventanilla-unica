import { describe, expect, it } from 'vitest'
import { appointmentOffers } from '../fixtures/appointmentOffers'
import { appointmentSlot } from '../fixtures/appointmentSlot'
import { parseAppointmentSlots } from './parseAppointmentSlots'
import { readAppointmentField } from './readAppointmentField'

describe('parseAppointmentSlots', () => {
  it('reads the offered codes and strips address markup without executing handlers', () => {
    expect(parseAppointmentSlots(appointmentOffers)).toEqual([appointmentSlot])
  })
  it('distinguishes explicit no availability from an expired or unknown page', () => {
    expect(parseAppointmentSlots('Citas sugeridas No hay citas')).toEqual([])
    expect(() => parseAppointmentSlots('Login')).toThrow('valid offer')
    expect(() =>
      parseAppointmentSlots('Citas sugeridas unknown layout'),
    ).toThrow('not recognized')
    expect(() =>
      parseAppointmentSlots('Citas sugeridas La provincia indicada no Existe'),
    ).toThrow('valid offer')
  })
  it('refuses truncated slot data', () => {
    expect(() => readAppointmentField("'centro': '123'", 'dia')).toThrow(
      'missing dia',
    )
  })
})
