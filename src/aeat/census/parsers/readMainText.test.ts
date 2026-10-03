import { describe, expect, it } from 'vitest'

import { readMainText } from './readMainText'

describe('readMainText', () => {
  it('reads only the main block when the page has one', () => {
    expect(
      readMainText('<nav>Menu</nav><main id="m"><p>No se puede</p></main>'),
    ).toBe('No se puede')
  })

  it('falls back to the whole page', () => {
    expect(readMainText('<p>error</p>')).toBe('error')
  })
})
