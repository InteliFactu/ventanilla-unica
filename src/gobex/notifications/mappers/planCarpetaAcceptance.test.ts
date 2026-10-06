import { describe, expect, it } from 'vitest'

import { planCarpetaAcceptance } from './planCarpetaAcceptance'

describe('planCarpetaAcceptance', () => {
  it('plans the acceptance of a pending notification', () => {
    const { plan, notes } = planCarpetaAcceptance(
      { status: 'Pendiente' },
      { id: 'N', confirm: false, outDir: '/o' },
    )
    expect(notes).toEqual([])
    expect(plan).toHaveLength(3)
    expect(plan[2]).toContain('/o')
  })

  it('plans only the download of an accepted one', () => {
    expect(
      planCarpetaAcceptance(
        { status: 'Notificado' },
        { id: 'N', confirm: true },
      ).plan,
    ).toEqual([
      'Already accepted (Notificado): nothing to accept.',
      'Without --out nothing is downloaded.',
    ])
  })

  it('refuses any other state', () => {
    expect(
      planCarpetaAcceptance({}, { id: 'N', confirm: true }).notes[0],
    ).toContain('in no known state')
  })
})
