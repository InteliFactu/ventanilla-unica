import { describe, expect, it } from 'vitest'

import { roleceReceiptZip } from '../fixtures/roleceReceiptZip'
import { isRoleceReceiptZip } from './isRoleceReceiptZip'

const footer = roleceReceiptZip.length - 22
const directory = roleceReceiptZip.readUInt32LE(footer + 16)

describe('isRoleceReceiptZip', () => {
  it('accepts deflated entries with streaming data descriptors', () => {
    const archive = Buffer.from(
      'UEsDBBQACAAIAAAAIVwAAAAAAAAAAAAAAAAQAAAAanVzdGlmaWNhbnRlLnhtbLMprswryUgtyUzWLUpNTs0sKNG3AwBQSwcIcSv3FxYAAAAUAAAAUEsDBBQACAAIAAAAIVwAAAAAAAAAAAAAAAAKAAAAcmVuZGVyLnhzbLMprswryUgtyUzWLS6pzEnVtwMAUEsHCPiuT7QUAAAAEgAAAFBLAQIUAxQACAAIAAAAIVxxK/cXFgAAABQAAAAQAAAAAAAAAAAAAACAAQAAAABqdXN0aWZpY2FudGUueG1sUEsBAhQDFAAIAAgAAAAhXPiuT7QUAAAAEgAAAAoAAAAAAAAAAAAAAIABVAAAAHJlbmRlci54c2xQSwUGAAAAAAIAAgB2AAAAoAAAAAAA',
      'base64',
    )

    expect(isRoleceReceiptZip(archive)).toBe(true)
  })

  it('accepts a valid archive comment containing the end record marker', () => {
    const comment = Buffer.alloc(32)
    comment.writeUInt32LE(0x06054b50)
    const archive = Buffer.concat([roleceReceiptZip, comment])
    archive.writeUInt16LE(comment.length, footer + 20)

    expect(isRoleceReceiptZip(archive)).toBe(true)
  })

  it('rejects an entry whose compressed data extends into the directory', () => {
    const removed = 5
    const archive = Buffer.concat([
      roleceReceiptZip.subarray(0, directory - removed),
      roleceReceiptZip.subarray(directory),
    ])
    archive.writeUInt32LE(directory - removed, footer - removed + 16)

    expect(isRoleceReceiptZip(archive)).toBe(false)
  })

  it('rejects a central record that extends past the directory', () => {
    const archive = Buffer.from(roleceReceiptZip)
    archive.writeUInt16LE(0xffff, directory + 28)

    expect(isRoleceReceiptZip(archive)).toBe(false)
  })
})
