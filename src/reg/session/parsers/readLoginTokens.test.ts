import { describe, expect, it } from 'vitest'

import { readLoginTokens } from './readLoginTokens'

describe('readLoginTokens', () => {
  it('reads both tokens from the landing URL', () => {
    expect(
      readLoginTokens(
        'https://reg.redsara.es/es/logincheck?token=a.b.c&refreshToken=r1',
      ),
    ).toEqual({ token: 'a.b.c', refreshToken: 'r1' })
  })

  it('is undefined when the relay answered without them', () => {
    expect(
      readLoginTokens('https://reg.redsara.es/es/loginKo?code=1'),
    ).toBeUndefined()
  })
})
