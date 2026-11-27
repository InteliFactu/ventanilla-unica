/** Find the end of a central ZIP entry after checking its record and payload bounds. */
export const readRoleceReceiptEntryEnd = (
  body: Buffer,
  entry: number,
  directoryStart: number,
  directoryEnd: number,
): number | undefined => {
  const centralHeaderSize = 46
  const localHeaderSize = 30
  if (
    entry + centralHeaderSize > directoryEnd ||
    body.readUInt32LE(entry) !== 0x02014b50
  ) {
    return undefined
  }
  const next =
    entry +
    centralHeaderSize +
    body.readUInt16LE(entry + 28) +
    body.readUInt16LE(entry + 30) +
    body.readUInt16LE(entry + 32)
  const local = body.readUInt32LE(entry + 42)
  if (
    next > directoryEnd ||
    local + localHeaderSize > directoryStart ||
    body.readUInt32LE(local) !== 0x04034b50
  ) {
    return undefined
  }
  const data =
    local +
    localHeaderSize +
    body.readUInt16LE(local + 26) +
    body.readUInt16LE(local + 28)
  const compressedSize = body.readUInt32LE(entry + 20)
  return data + compressedSize <= directoryStart ? next : undefined
}
