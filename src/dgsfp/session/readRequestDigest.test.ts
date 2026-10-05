import { describe, expect, it } from 'vitest'

import { readRequestDigest } from './readRequestDigest'

describe('readRequestDigest', () => {
  it('reads the hidden digest input', () => {
    expect(
      readRequestDigest(
        '<input type="hidden" name="__REQUESTDIGEST" id="__REQUESTDIGEST" value="0xAB,05 Oct 2026" />',
      ),
    ).toBe('0xAB,05 Oct 2026')
  })

  it('is undefined without one', () => {
    expect(readRequestDigest('<p/>')).toBeUndefined()
  })
})
