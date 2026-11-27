import { describe, expect, it } from 'vitest'

import { buildFixedWidthRecord } from './builders/buildFixedWidthRecord'
import type { FixedWidthSchema } from './types/FixedWidthSchema'
import { validateFixedWidthRecord } from './validators/validateFixedWidthRecord'
import { validateFixedWidthSchema } from './validators/validateFixedWidthSchema'

const schema: FixedWidthSchema = {
  recordLength: 12,
  fields: [
    { name: 'kind', start: 1, length: 1, kind: 'N' },
    { name: 'name', start: 2, length: 6, kind: 'A' },
    { name: 'amount', start: 10, length: 3, kind: 'N' },
  ],
}

describe('BOE fixed-width records', () => {
  it('writes aligned, padded and normalised fields', () => {
    expect(
      buildFixedWidthRecord(schema, { kind: 1, name: 'Peña', amount: 7 }),
    ).toBe('1PEÑA   ' + ' 007')
  })

  it('refuses values that do not fit or are not digits', () => {
    expect(() => buildFixedWidthRecord(schema, { name: 'ABCDEFG' })).toThrow(
      /does not fit/,
    )
    expect(() => buildFixedWidthRecord(schema, { amount: '1a' })).toThrow(
      /not valid digits/,
    )
  })

  it('validates length and field contents', () => {
    expect(validateFixedWidthRecord(schema, '1PEÑA    007')).toEqual([])
    expect(validateFixedWidthRecord(schema, 'short')).toHaveLength(1)
    expect(validateFixedWidthRecord(schema, '1pena    007')).toHaveLength(1)
  })

  it('rejects a design with overlaps, duplicates or out-of-range fields', () => {
    const bad: FixedWidthSchema = {
      recordLength: 5,
      fields: [
        { name: 'a', start: 1, length: 3, kind: 'A' },
        { name: 'a', start: 3, length: 4, kind: 'A' },
      ],
    }
    expect(validateFixedWidthSchema(bad)).toHaveLength(3)
    for (const field of [
      { name: 'f', start: 1.5, length: 1, kind: 'A' as const },
      { name: 'f', start: Number.NaN, length: 1, kind: 'A' as const },
      { name: 'f', start: 1, length: 0, kind: 'A' as const },
    ])
      expect(
        validateFixedWidthSchema({ recordLength: 5, fields: [field] }),
      ).toHaveLength(1)
    expect(
      validateFixedWidthSchema({ recordLength: -1, fields: [] }),
    ).toHaveLength(1)
    expect(validateFixedWidthSchema(schema)).toEqual([])
  })

  it('requires uncovered positions to be blank and A fields left aligned', () => {
    const partial: FixedWidthSchema = {
      recordLength: 5,
      fields: [{ name: 'a', start: 1, length: 2, kind: 'A' }],
    }
    expect(validateFixedWidthRecord(partial, 'AB!\n!')).toHaveLength(3)
    expect(validateFixedWidthRecord(partial, 'AB   ')).toEqual([])
    const three: FixedWidthSchema = {
      recordLength: 3,
      fields: [{ name: 'a', start: 1, length: 3, kind: 'A' }],
    }
    expect(validateFixedWidthRecord(three, '  A')).toHaveLength(1)
  })

  it('validates the design before a record', () => {
    const overlap: FixedWidthSchema = {
      recordLength: 3,
      fields: [
        { name: 'a', start: 1, length: 2, kind: 'N' },
        { name: 'b', start: 2, length: 2, kind: 'N' },
      ],
    }
    expect(validateFixedWidthRecord(overlap, '123')).not.toEqual([])
  })

  it('keeps an X field verbatim', () => {
    const email: FixedWidthSchema = {
      recordLength: 20,
      fields: [{ name: 'email', start: 1, length: 20, kind: 'X' }],
    }
    const record = buildFixedWidthRecord(email, { email: 'alice@example.com' })
    expect(record).toBe('alice@example.com   ')
    expect(validateFixedWidthRecord(email, record)).toEqual([])
  })
})
