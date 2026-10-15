/** The parts of a TSTInfo a reply is checked by. */
export type TstInfoParts = {
  /** The hashedMessage of its messageImprint. */
  readonly imprint: Buffer
  /** The nonce magnitude, leading zero bytes dropped; empty when absent. */
  readonly nonce: Buffer
}
