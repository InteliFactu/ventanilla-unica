import { describe, expect, it } from 'vitest'

import { selectAutoScriptFamily } from './selectAutoScriptFamily'

describe('selectAutoScriptFamily', () => {
  it.each([
    ['NONE', 'none'],
    ['PKCS#1', 'none'],
    ['CAdES', 'cades'],
    ['CAdEStri', 'cades'],
    ['CMS/PKCS#7', 'cades'],
    ['XAdES', 'xades'],
    ['XAdES Detached', 'xades'],
    ['XAdEStri', 'xades'],
    ['FacturaE', 'facturae'],
    ['PAdES', 'pades'],
    ['Adobe PDF', 'pades'],
  ])('maps %s', (format, family) => {
    expect(selectAutoScriptFamily(format)).toBe(family)
  })

  it.each(['XAdES-ASiC-S', 'OOXML', 'XMLDSig', 'auto'])(
    'refuses %s',
    (format) => {
      expect(() => selectAutoScriptFamily(format)).toThrow(
        /unsupported AutoScript format/,
      )
    },
  )
})
