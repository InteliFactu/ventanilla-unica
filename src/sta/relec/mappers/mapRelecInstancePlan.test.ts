import { describe, expect, it } from 'vitest'

import type { RelecForm } from '../types/RelecForm'
import { mapRelecInstancePlan } from './mapRelecInstancePlan'
import { mapRelecInstancePlanLines } from './mapRelecInstancePlanLines'

const form: RelecForm = {
  fields: {
    solicituddesc: 'Instancia general ',
    DinTitANNOT_TEXT_EXTRACT: 'Asunto:',
    '61_NEWDocReq': '61',
    '61_NEWname': 'Instancia General',
    '61_NEWrequired': 'true',
    '61_NEWtipo': '2017A',
    '62_NEWDocReq': '62',
    '62_NEWname': 'Otros documentos de entrada',
    '62_NEWtipo': '2017B',
  },
  holder: { name: 'ANA PRUEBA', nif: '00000000T' },
  represented: [
    {
      name: 'EMPRESA SL',
      nif: 'B00000000',
      dboid: '9',
      personType: 'RJ',
      fields: {},
    },
  ],
  contact: { email: 'a@example.com' },
  address: { id: 'new', fields: {} },
  defaultStreetType: '',
}

const file = { path: '/x/a.pdf', name: 'a.pdf', bytes: 3, sha256: 'ab' }

describe('mapRelecInstancePlan', () => {
  it('maps each document to its row and reports missing required rows', () => {
    const plan = mapRelecInstancePlan(
      'sede.caceres.es',
      { subject: 'Asunto', documents: ['/x/a.pdf'], rows: ['62'] },
      form,
      [file],
    )
    expect(plan.procedure).toBe('Instancia general')
    expect(plan.represented).toBeUndefined()
    expect(plan.documents[0]?.slot.name).toBe('Otros documentos de entrada')
    expect(plan.missingRequired).toEqual(['Instancia General'])
    expect(mapRelecInstancePlanLines(plan)).toContain(
      'Missing required rows: Instancia General',
    )
  })

  it('files for a represented entity only when the form offers it', () => {
    const query = {
      subject: 'Asunto',
      documents: ['/x/a.pdf'],
      rows: ['instancia general'],
      represented: 'B00000000',
    }
    const plan = mapRelecInstancePlan('h', query, form, [file])
    expect(plan.represented).toEqual({ name: 'EMPRESA SL', nif: 'B00000000' })
    expect(plan.missingRequired).toEqual([])
    expect(() =>
      mapRelecInstancePlan('h', { ...query, represented: 'B1' }, form, [file]),
    ).toThrow('not offered')
    expect(() =>
      mapRelecInstancePlan('h', { ...query, rows: ['Nada'] }, form, [file]),
    ).toThrow('no row "Nada"')
  })

  it('refuses a form without the Asunto field', () => {
    const fields = Object.fromEntries(
      Object.entries(form.fields).filter(([key]) => !key.startsWith('DinTit')),
    )
    expect(() =>
      mapRelecInstancePlan(
        'h',
        { subject: 'a', documents: [], rows: [] },
        { ...form, fields },
        [],
      ),
    ).toThrow('ANNOT_TEXT_EXTRACT')
  })
})
