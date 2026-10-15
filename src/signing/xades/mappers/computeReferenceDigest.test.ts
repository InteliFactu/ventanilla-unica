import { describe, expect, it } from 'vitest'

import { parseXmlDocument } from '../../xml/parsers/parseXmlDocument'
import { computeReferenceDigest } from './computeReferenceDigest'
import { digestBase64 } from './digestBase64'

describe('computeReferenceDigest', () => {
  const document = parseXmlDocument(
    '<?p?><r xmlns:n="u"><!--c--><x Id="i">t</x><s/></r>',
  )
  const signature = document.root.children.at(-1)
  if (signature?.kind !== 'element') throw new Error('no signature element')

  it('digests the document without the signature and comments', () => {
    expect(
      computeReferenceDigest(
        document,
        signature,
        { kind: 'enveloped' },
        'sha256',
      ),
    ).toBe(digestBase64('sha256', '<?p?>\n<r xmlns:n="u"><x Id="i">t</x></r>'))
  })
  it('digests the signed node without the signature or the prolog', () => {
    expect(
      computeReferenceDigest(
        document,
        signature,
        {
          kind: 'enveloped',
          node: 'i',
        },
        'sha256',
      ),
    ).toBe(digestBase64('sha256', '<x xmlns:n="u" Id="i">t</x>'))
    expect(
      computeReferenceDigest(
        parseXmlDocument('<?p?><r id="root"><a/><s/></r>'),
        signature,
        { kind: 'enveloped', node: 'root' },
        'sha256',
      ),
    ).toBe(digestBase64('sha256', '<r id="root"><a></a><s></s></r>'))
  })
  it('digests an element by Id in its namespace context', () => {
    expect(
      computeReferenceDigest(
        document,
        signature,
        { kind: 'id', id: 'i' },
        'sha256',
      ),
    ).toBe(digestBase64('sha256', '<x xmlns:n="u" Id="i">t</x>'))
  })
  it('digests raw bytes', () => {
    expect(
      computeReferenceDigest(
        document,
        signature,
        {
          kind: 'bytes',
          data: Buffer.from('abc'),
        },
        'sha512',
      ),
    ).toBe(digestBase64('sha512', 'abc'))
  })
})
