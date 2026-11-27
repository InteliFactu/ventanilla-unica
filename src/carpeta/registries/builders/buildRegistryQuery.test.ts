import { describe, expect, it } from 'vitest'

import { buildRegistryQuery } from './buildRegistryQuery'

const now = new Date('2026-11-01T11:00:00.000Z')

describe('buildRegistryQuery', () => {
  it('defaults to the last 30 days ending now', () => {
    expect(buildRegistryQuery({}, now)).toEqual({
      from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      to: now,
      number: undefined,
    })
  })

  it('takes a whole-day range and a registry number', () => {
    expect(
      buildRegistryQuery(
        {
          desde: '01/10/2026',
          hasta: '05/10/2026',
          registro: ' REGAGE26e00000000001 ',
        },
        now,
      ),
    ).toEqual({
      from: new Date('2026-09-30T22:00:00.000Z'),
      to: new Date('2026-10-05T21:59:59.999Z'),
      number: 'REGAGE26e00000000001',
    })
  })

  it.each([
    ['29/03/2026', '2026-03-28T23:00:00.000Z', '2026-03-29T21:59:59.999Z'],
    ['25/10/2026', '2026-10-24T22:00:00.000Z', '2026-10-25T22:59:59.999Z'],
  ])('uses the Madrid day boundaries on %s', (date, from, to) => {
    expect(buildRegistryQuery({ desde: date, hasta: date }, now)).toEqual({
      from: new Date(from),
      to: new Date(to),
      number: undefined,
    })
  })

  it.each(['10/13/2025', '10/00/2026', '31/02/2026'])(
    'refuses the nonexistent calendar day %s',
    (date) => {
      expect(() => buildRegistryQuery({ desde: date }, now)).toThrow(
        '--desde must be a dd/mm/aaaa date',
      )
    },
  )

  it('refuses bad dates and an inverted range', () => {
    expect(() => buildRegistryQuery({ desde: '2026-10-01' }, now)).toThrow(
      '--desde must be a dd/mm/aaaa date',
    )
    expect(() => buildRegistryQuery({ hasta: '31/02/2026' }, now)).toThrow(
      '--hasta must be a dd/mm/aaaa date',
    )
    expect(() =>
      buildRegistryQuery({ desde: '02/10/2026', hasta: '01/10/2026' }, now),
    ).toThrow('--desde must not be after --hasta')
  })

  it('refuses a blank registry lookup instead of listing all entries', () => {
    expect(() => buildRegistryQuery({ registro: '  ' }, now)).toThrow(
      '--registro must be a nonempty registry number',
    )
  })
})
