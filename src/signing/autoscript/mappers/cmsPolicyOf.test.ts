import { describe, expect, it } from 'vitest'

import { agePolicyCms } from '../../cms/agePolicyCms'
import { parseExtraParams } from '../parsers/parseExtraParams'
import { cmsPolicyOf } from './cmsPolicyOf'

describe('cmsPolicyOf', () => {
  it('is BES without a policy and the AGE one on expPolicy', () => {
    expect(cmsPolicyOf(parseExtraParams(''))).toBeUndefined()
    expect(cmsPolicyOf(parseExtraParams('expPolicy=FirmaAGE'))).toBe(
      agePolicyCms,
    )
  })

  it('reads an explicit policy, urn:oid stripped', () => {
    const params = parseExtraParams(
      'policyIdentifier=urn:oid:1.2.3\npolicyIdentifierHash=AAAA\npolicyIdentifierHashAlgorithm=SHA-256',
    )
    expect(cmsPolicyOf(params)).toEqual({
      oid: '1.2.3',
      digest: 'sha256',
      digestValue: 'AAAA',
      uri: undefined,
    })
  })

  it('refuses a non-OID identifier or a missing hash', () => {
    expect(() =>
      cmsPolicyOf(
        parseExtraParams(
          'policyIdentifier=http://x\npolicyIdentifierHash=AAAA',
        ),
      ),
    ).toThrow('must be an OID')
    expect(() =>
      cmsPolicyOf(parseExtraParams('policyIdentifier=1.2.3')),
    ).toThrow('needs policyIdentifierHash')
  })
})
