import { describe, expect, it } from 'vitest'

import type { Command } from './types/Command'
import { usageText } from './usageText'

const command = (portal: string, action: string): Command => ({
  portal,
  action,
  description: 'desc',
  options: [],
  run: async () => Promise.resolve(null),
})

describe('usageText', () => {
  it('leaves a gap after the longest command and aligns the rest to it', () => {
    const lines = usageText([
      command('aeat', 'certificado-corriente'),
      command('ine', 'x'),
    ]).split('\n')

    expect(lines).toContain('  aeat certificado-corriente  desc')
    expect(lines).toContain(`  ine x${' '.repeat(23)}desc`)
  })
})
