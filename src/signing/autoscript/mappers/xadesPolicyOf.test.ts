import { describe, expect, it } from 'vitest'

import { agePolicy } from '../../xades/agePolicy'
import { digestUris } from '../../xades/digestUris'
import { parseExtraParams } from '../parsers/parseExtraParams'
import { xadesPolicyOf } from './xadesPolicyOf'

describe('xadesPolicyOf', () => {
  it('is BES without a policy and the AGE one on expPolicy', () => {
    expect(xadesPolicyOf(parseExtraParams(''))).toBeUndefined()
    expect(xadesPolicyOf(parseExtraParams('expPolicy=FirmaAGE19'))).toBe(
      agePolicy,
    )
  })

  it('writes a bare OID as urn:oid and defaults the hash to SHA-1', () => {
    const policy = xadesPolicyOf(
      parseExtraParams('policyIdentifier=1.2.3\npolicyIdentifierHash=AAAA'),
    )
    expect(policy?.identifier).toBe('urn:oid:1.2.3')
    expect(policy?.digestAlgorithm).toBe(digestUris.sha1)
  })
})
