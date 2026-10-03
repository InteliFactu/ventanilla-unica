import { describe, expect, it } from 'vitest'

import { parseXmlDocument } from '../../xml/parsers/parseXmlDocument'
import { selectPathBySignedNodeId } from './selectPathBySignedNodeId'

describe('selectPathBySignedNodeId', () => {
  const { root } = parseXmlDocument('<a><b Id="x"/><c id="y"/><d ID="z"/></a>')
  it('finds the element by any of the three id spellings', () => {
    expect(selectPathBySignedNodeId(root, 'x').at(-1)?.name).toBe('b')
    expect(selectPathBySignedNodeId(root, 'y').at(-1)?.name).toBe('c')
    expect(selectPathBySignedNodeId(root, 'z').at(-1)?.name).toBe('d')
  })
  it('fails when no element carries that id', () => {
    expect(() => selectPathBySignedNodeId(root, 'w')).toThrow(
      'no element to sign with id "w"',
    )
  })
})
