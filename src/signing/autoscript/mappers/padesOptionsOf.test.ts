import { describe, expect, it } from 'vitest'

import { agePolicyCms } from '../../cms/agePolicyCms'
import { parseExtraParams } from '../parsers/parseExtraParams'
import { padesOptionsOf } from './padesOptionsOf'

describe('padesOptionsOf', () => {
  it('reads the placement, text and subfilter parameters', () => {
    expect(
      padesOptionsOf(
        parseExtraParams(
          [
            'signatureSubFilter=adbe.pkcs7.detached',
            'signerContact=ana@example.org',
            'signaturePage=-1',
            'signaturePositionOnPageLowerLeftX=10',
            'signaturePositionOnPageLowerLeftY=20',
            'signaturePositionOnPageUpperRightX=210',
            'signaturePositionOnPageUpperRightY=80',
            'layer2Text=Firmado por $$SUBJECTCN$$',
          ].join('\n'),
        ),
        'sha256',
      ),
    ).toMatchObject({
      subFilter: 'adbe.pkcs7.detached',
      contactInfo: 'ana@example.org',
      page: -1,
      rect: [10, 20, 210, 80],
      text: 'Firmado por $$SUBJECTCN$$',
    })
  })

  it('forces ETSI under a policy and ignores a partial rectangle', () => {
    const options = padesOptionsOf(
      parseExtraParams(
        'expPolicy=FirmaAGE\nsignatureSubFilter=adbe.pkcs7.detached\nsignaturePositionOnPageLowerLeftX=10',
      ),
      'sha512',
    )
    expect(options).toMatchObject({
      policy: agePolicyCms,
      subFilter: undefined,
      rect: undefined,
    })
  })

  it('refuses an unknown subfilter', () => {
    expect(() =>
      padesOptionsOf(
        parseExtraParams('signatureSubFilter=adbe.x509.rsa_sha1'),
        'sha256',
      ),
    ).toThrow('unsupported signatureSubFilter')
  })
})
