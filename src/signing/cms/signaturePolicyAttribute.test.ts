import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { agePolicyCms } from './agePolicyCms'
import { cmsOids } from './cmsOids'
import { signaturePolicyAttribute } from './signaturePolicyAttribute'

describe('signaturePolicyAttribute', () => {
  it('names the policy, its SHA-1 hash and the SPURI', () => {
    const attribute = signaturePolicyAttribute(agePolicyCms)
    expect(attribute.includes(derOid(cmsOids.signaturePolicyIdentifier))).toBe(
      true,
    )
    expect(attribute.includes(derOid(agePolicyCms.oid))).toBe(true)
    expect(attribute.includes(derOid(cmsOids.sha1))).toBe(true)
    expect(
      attribute.includes(Buffer.from(agePolicyCms.digestValue, 'base64')),
    ).toBe(true)
    expect(attribute.includes(derOid(cmsOids.policyQualifierUri))).toBe(true)
    expect(attribute.toString('latin1')).toContain(agePolicyCms.uri)
  })

  it('leaves the qualifiers out without a URI', () => {
    const attribute = signaturePolicyAttribute({
      ...agePolicyCms,
      uri: undefined,
    })
    expect(attribute.includes(derOid(cmsOids.policyQualifierUri))).toBe(false)
  })
})
