import { describe, expect, it } from 'vitest'

import { buildModel303Page } from './builders/buildModel303Page'

describe('buildModel303Page', () => {
  it('writes distinct amounts at their exact positions with the official sign marker', () => {
    const page = buildModel303Page({
      ejercicio: '2026',
      tag: '03000',
      values: { 391: '217', 340: '-25' },
    })
    expect(page).toHaveLength(1017)
    expect(page.slice(339, 356)).toBe('N0000000000000025')
    expect(page.slice(390, 407)).toBe('00000000000000217')
    expect(() =>
      buildModel303Page({
        ejercicio: '2026',
        tag: '03000',
        values: { 392: '1' },
      }),
    ).toThrow(/392.*field/)
    expect(() =>
      buildModel303Page({
        ejercicio: '2026',
        tag: '03000',
        values: { 340: '-' },
      }),
    ).toThrow(/340-356/)
    expect(() =>
      buildModel303Page({
        ejercicio: '2026',
        tag: '01000',
        values: { 23: 'Ā' },
      }),
    ).toThrow(/23-102/)
  })
})
