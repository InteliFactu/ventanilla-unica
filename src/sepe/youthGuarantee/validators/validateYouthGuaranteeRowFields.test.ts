import { describe, expect, it } from 'vitest'

import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'
import { validateYouthGuaranteeAnswers } from './validateYouthGuaranteeAnswers'
import { validateYouthGuaranteeRequiredFields } from './validateYouthGuaranteeRequiredFields'

const select = (name: string, required: boolean) => ({
  name,
  label: name,
  type: 'select',
  required,
  readOnly: false,
  options: [{ value: '1', label: 'Offered' }],
})

const pages = (required: boolean): readonly YouthGuaranteePage[] => [
  {
    step: 4,
    title: 'Experience',
    fields: [select('experienciaLaboral.tcodOcupacion', required)],
  },
  {
    step: 5,
    title: 'Interests',
    fields: [
      select('interesOcupacion.tcodInteresOcupacion', required),
      select('interesSector.tcodSector', required),
    ],
  },
]

describe('row-dependent answers on steps 4 and 5', () => {
  it.each([
    ['4', 'experienciaLaboral.tcodOcupacion'],
    ['5', 'interesOcupacion.tcodInteresOcupacion'],
    ['5', 'interesSector.tcodSector'],
  ])('refuses an offered answer for step %s %s', (step, name) => {
    expect(() => {
      validateYouthGuaranteeAnswers({ [step]: { [name]: '1' } }, pages(false))
    }).toThrow(/add-row sub-flow this command does not drive/)
  })
  it('refuses a required row before any write instead of skipping it', () => {
    expect(() => {
      validateYouthGuaranteeRequiredFields({}, pages(true))
    }).toThrow(/requires a row for experienciaLaboral.tcodOcupacion/)
  })
  it('lets optional rows stay empty', () => {
    expect(() => {
      validateYouthGuaranteeRequiredFields({}, pages(false))
    }).not.toThrow()
  })
})
