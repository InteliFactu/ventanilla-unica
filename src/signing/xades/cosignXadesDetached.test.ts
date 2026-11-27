/* eslint-disable security/detect-non-literal-fs-filename -- both paths are fixed, checked-in AutoFirma fixtures */
import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { signAutoScript } from '../autoscript/signAutoScript'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { cosignXadesSignature } from './cosignXadesSignature'
import { hasXmlsec } from './fixtures/hasXmlsec'
import { listSignatureIds } from './fixtures/listSignatureIds'
import { xmlsecVerifies } from './fixtures/xmlsecVerifies'
import { signXml } from './signXml'

const first = buildTestIdentity('FIRST')
const second = buildTestIdentity('SECOND')
const document = Buffer.from('<invoice><amount>1.23</amount></invoice>\n')
const detached = readFileSync(
  new URL('./fixtures/autoFirmaExternalDetached.xsig', import.meta.url),
)

describe('detached XAdES cosigning', () => {
  it.skipIf(!hasXmlsec).each(['<doc>synthetic</doc>', 'binary sample'])(
    'verifies both internally detached signatures for %s',
    (input) => {
      const original = signXml(first, Buffer.from(input), {
        mode: 'internally-detached',
      }).xml
      const cosigned = cosignXadesSignature(second, original)
      const ids = listSignatureIds(cosigned)
      expect(ids).toHaveLength(2)
      expect(cosigned.toString().match(/<CONTENT /gu)).toHaveLength(1)
      for (const id of ids)
        expect(xmlsecVerifies(cosigned, undefined, id)).toBe('')
    },
  )

  it.skipIf(!hasXmlsec)(
    'cosigns the detached data supplied by AutoScript',
    async () => {
      const result = await signAutoScript(second, {
        operation: 'cosign',
        format: 'XAdES',
        algorithm: 'SHA512withRSA',
        signature: detached.toString('base64'),
        data: document.toString('base64'),
      })
      const cosigned = Buffer.from(result.signature, 'base64')
      const ids = listSignatureIds(cosigned)
      expect(ids).toHaveLength(2)
      expect(cosigned.toString().match(/URI="invoice\.xml"/gu)).toHaveLength(2)
      for (const id of ids)
        expect(xmlsecVerifies(cosigned, document, id)).toBe('')
    },
  )

  it('refuses a detached cosignature when the original data is missing or different', async () => {
    await expect(
      signAutoScript(second, {
        operation: 'cosign',
        format: 'XAdES',
        algorithm: 'SHA256withRSA',
        signature: detached.toString('base64'),
        data: 'b3RoZXI=',
      }),
    ).rejects.toThrow('does not match the original XAdES reference')
    expect(() => cosignXadesSignature(second, detached)).toThrow(
      'needs the original detached data',
    )
  })

  it.skipIf(!hasXmlsec)(
    'retains every detached signature when cosigned again',
    () => {
      const cosigned = cosignXadesSignature(second, detached, {
        detachedContent: document,
      })
      const again = cosignXadesSignature(first, cosigned, {
        detachedContent: document,
      })
      const ids = listSignatureIds(again)
      expect(ids).toHaveLength(3)
      for (const id of ids) expect(xmlsecVerifies(again, document, id)).toBe('')
    },
  )

  it.skipIf(!hasXmlsec)(
    'cosigns the AutoFirma sibling in its original namespace context',
    () => {
      const original = readFileSync(
        new URL('./fixtures/autoFirmaInternalSibling.xsig', import.meta.url),
      )
      const cosigned = cosignXadesSignature(second, original)
      const ids = listSignatureIds(cosigned)
      expect(ids).toHaveLength(2)
      for (const id of ids)
        expect(
          xmlsecVerifies(cosigned, undefined, id, ['urn:fixture:payload']),
        ).toBe('')
    },
  )
})
