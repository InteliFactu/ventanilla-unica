import { describe, expect, it } from 'vitest'

import { renderTestElement } from '../fixtures/renderTestElement'
import { buildReference } from './buildReference'

describe('buildReference', () => {
  it('writes Id, Type, URI, transforms and a fillable digest', () => {
    const { element, pending } = buildReference(
      'ds',
      {
        id: 'R',
        type: 'T',
        uri: '',
        transforms: ['t1', 't2'],
        target: { kind: 'enveloped' },
      },
      'http://www.w3.org/2001/04/xmlenc#sha256',
    )
    pending.digest.value = 'd='
    expect(renderTestElement(element)).toBe(
      '<ds:Reference Id="R" Type="T" URI=""><ds:Transforms><ds:Transform Algorithm="t1"></ds:Transform><ds:Transform Algorithm="t2"></ds:Transform></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"></ds:DigestMethod><ds:DigestValue>d=</ds:DigestValue></ds:Reference>',
    )
    expect(pending.target).toEqual({ kind: 'enveloped' })
  })
  it('omits Id, Type and Transforms when absent', () => {
    const { element } = buildReference(
      'ds',
      { uri: '#x', transforms: [], target: { kind: 'id', id: 'x' } },
      'd',
    )
    expect(element.attributes).toEqual([{ name: 'URI', value: '#x' }])
    expect(element.children).toHaveLength(2)
  })
})
