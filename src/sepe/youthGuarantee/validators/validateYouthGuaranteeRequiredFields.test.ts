import { describe, expect, it } from 'vitest'

import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'
import { validateYouthGuaranteeRequiredFields } from './validateYouthGuaranteeRequiredFields'

const pages: readonly YouthGuaranteePage[] = [
  {
    step: 2,
    title: 'Address',
    fields: [
      {
        name: 'datosDireccionContacto.nombreViaC',
        label: 'Alternative street (*)',
        type: 'text',
        required: true,
        readOnly: false,
        options: [],
      },
      {
        name: 'datosContacto.notificaApartadoCorreos.apartadoCorreosC',
        label: 'PO box (*)',
        type: 'text',
        required: true,
        readOnly: false,
        options: [],
      },
    ],
  },
]

describe('conditional required address fields', () => {
  it('does not require either alternative when the holder chose the residential address', () => {
    expect(() => {
      validateYouthGuaranteeRequiredFields(
        { '2': { 'datosDireccionContacto.tipoDomicilioC': 'R' } },
        pages,
      )
    }).not.toThrow()
  })
  it('requires the alternative street only when that address mode is selected', () => {
    expect(() => {
      validateYouthGuaranteeRequiredFields(
        { '2': { 'datosDireccionContacto.tipoDomicilioC': 'C' } },
        pages,
      )
    }).toThrow(/datosDireccionContacto.nombreViaC/)
  })
  it('requires a PO box only when that address mode is selected', () => {
    expect(() => {
      validateYouthGuaranteeRequiredFields(
        { '2': { 'datosDireccionContacto.tipoDomicilioC': 'A' } },
        pages,
      )
    }).toThrow(/apartadoCorreosC/)
  })
})
