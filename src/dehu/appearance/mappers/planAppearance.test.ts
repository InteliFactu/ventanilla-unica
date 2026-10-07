import { describe, expect, it } from 'vitest'

import { planAppearance } from './planAppearance'

describe('planAppearance', () => {
  it('names the identifiers and warns that deadlines start', () => {
    const plan = planAppearance(['A', 'B'])
    expect(plan[0]).toContain('A, B')
    expect(plan.join('\n')).toMatch(/deadline it carries/)
  })
})
