import { describe, expect, it } from 'vitest'

import { readServiceError } from './readServiceError'

describe('readServiceError', () => {
  it('keeps a short message without its JSON quotes', () => {
    expect(readServiceError('x', 400, '"Falta un dato"')).toBe(
      'DGSFP x: Falta un dato',
    )
  })

  it('falls back to the status for an HTML error page', () => {
    expect(readServiceError('x', 500, '<html>error</html>')).toBe(
      'DGSFP x: HTTP 500',
    )
  })
})
