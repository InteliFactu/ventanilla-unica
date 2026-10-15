import { describe, expect, it } from 'vitest'

import { parseExtraParams } from '../parsers/parseExtraParams'
import { xadesOptionsOf } from './xadesOptionsOf'

describe('xadesOptionsOf', () => {
  it('takes AutoFirma defaults: SHA-512 references, full signed KeyInfo', () => {
    const options = xadesOptionsOf('XAdES', parseExtraParams(''), 'sha256')
    expect(options.referencesDigest).toBe('sha512')
    expect(options.keyInfo).toEqual({
      chain: true,
      keyValue: true,
      reference: true,
    })
    expect(options.signerRoles).toEqual([])
  })

  it('switches each part off by its parameter', () => {
    const options = xadesOptionsOf(
      'XAdES',
      parseExtraParams(
        'referencesDigestMethod=SHA-256\nincludeOnlySignningCertificate=true\naddKeyInfoKeyValue=false\nkeepKeyInfoUnsigned=true\nnodeToSign=n1',
      ),
      'sha1',
    )
    expect(options).toMatchObject({
      referencesDigest: 'sha256',
      keyInfo: { chain: false, keyValue: false, reference: false },
      signedNodeId: 'n1',
      signatureDigest: 'sha1',
    })
  })
})
