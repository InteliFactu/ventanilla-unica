import { describe, expect, it } from 'vitest'

import { buildStampObjects } from './buildStampObjects'

describe('buildStampObjects', () => {
  it('allocates a Helvetica font and a form XObject using it', () => {
    const allocator = { next: 10 }
    const stamp = buildStampObjects(allocator, ['ANA'], [36, 36, 336, 86])
    expect(allocator.next).toBe(12)
    expect(stamp.appearance).toEqual({ kind: 'ref', num: 11, gen: 0 })
    const [font, form] = stamp.objects.map((object) =>
      object.bytes.toString('latin1'),
    )
    expect(font).toContain('/BaseFont /Helvetica /Encoding /WinAnsiEncoding')
    expect(form).toContain('/Resources << /Font << /Helv 10 0 R >> >>')
    expect(form).toContain('/BBox [0 0 300 50]')
    expect(stamp.rect).toEqual([36, 36, 336, 86])
  })
})
