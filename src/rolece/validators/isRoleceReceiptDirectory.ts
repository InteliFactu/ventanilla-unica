import { readRoleceReceiptEntryEnd } from '../parsers/readRoleceReceiptEntryEnd'

/** Check that the central directory describes each entry and reaches the footer. */
export const isRoleceReceiptDirectory = (
  body: Buffer,
  footer: number,
): boolean => {
  const entries = body.readUInt16LE(footer + 10)
  const size = body.readUInt32LE(footer + 12)
  const start = body.readUInt32LE(footer + 16)
  if (
    body.readUInt32LE(footer + 4) !== 0 ||
    body.readUInt16LE(footer + 8) !== entries ||
    entries === 0 ||
    start < 30 ||
    start + size !== footer
  ) {
    return false
  }

  let entry = start
  for (let index = 0; index < entries; index += 1) {
    const next = readRoleceReceiptEntryEnd(body, entry, start, footer)
    if (next === undefined) return false
    entry = next
  }
  return entry === footer
}
