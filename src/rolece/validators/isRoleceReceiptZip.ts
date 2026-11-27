import { isRoleceReceiptDirectory } from './isRoleceReceiptDirectory'

/** Check the structure of a nonempty, single-disk ROLECE receipt ZIP. */
export const isRoleceReceiptZip = (body: Buffer): boolean => {
  const endRecordSize = 22
  if (body.length < endRecordSize || body.readUInt32LE(0) !== 0x04034b50) {
    return false
  }
  const signature = Buffer.from('504b0506', 'hex')
  const latest = body.length - endRecordSize
  const earliest = Math.max(1, latest - 0xffff)
  let end = body.lastIndexOf(signature, latest)
  while (end >= earliest) {
    const commentLength = body.readUInt16LE(end + 20)
    if (
      end + endRecordSize + commentLength === body.length &&
      isRoleceReceiptDirectory(body, end)
    ) {
      return true
    }
    end = body.lastIndexOf(signature, end - 1)
  }
  return false
}
