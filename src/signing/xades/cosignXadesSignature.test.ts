import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { cosignXadesSignature } from './cosignXadesSignature'
import { hasXmlsec } from './fixtures/hasXmlsec'
import { listSignatureIds } from './fixtures/listSignatureIds'
import { xmlsecVerifies } from './fixtures/xmlsecVerifies'
import { signXml } from './signXml'
import type { XadesMode } from './types/XadesMode'

const first = buildTestIdentity('FIRST')
const second = buildTestIdentity('SECOND', undefined, 'ec')
const document = Buffer.from('<doc><item>synthetic</item></doc>')

describe('cosignXadesSignature', () => {
  it.skipIf(!hasXmlsec).each(['enveloped', 'enveloping'] as const)(
    'adds a second %s signature, both valid',
    (mode: XadesMode) => {
      const cosigned = cosignXadesSignature(
        second,
        signXml(first, document, { mode }).xml,
      )
      const ids = listSignatureIds(cosigned)
      expect(ids).toHaveLength(2)
      expect(/^<\?xml[^>]*>\n<AFIRMA Id=/.test(cosigned.toString())).toBe(
        mode === 'enveloping',
      )
      for (const id of ids)
        expect(xmlsecVerifies(cosigned, undefined, id)).toBe('')
    },
  )

  it('refuses detached signatures and unsigned XML', () => {
    const detached = signXml(first, document, {
      mode: 'internally-detached',
    }).xml
    expect(() => cosignXadesSignature(second, detached)).toThrow(
      'only enveloped and enveloping',
    )
    expect(() => cosignXadesSignature(second, document)).toThrow(
      'carries no signature',
    )
  })
})
