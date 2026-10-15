import { describe, expect, it } from 'vitest'

import { byteRangePlaceholder } from './byteRangePlaceholder'
import { signatureContentsBytes } from './signatureContentsBytes'

describe('signature placeholders', () => {
  it('keep a fixed width and a 16 KiB CMS budget', () => {
    expect(byteRangePlaceholder).toHaveLength(36)
    expect(signatureContentsBytes).toBe(27000)
  })
})
