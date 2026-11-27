import type { LegacyFaceDelivery } from '../LegacyFaceDelivery'

/** Accept one simple email address and a portable, path-free signed filename. */
export const assertLegacyFaceDelivery = (
  delivery: LegacyFaceDelivery,
): void => {
  if (
    !/^[\p{L}\p{N}][\p{L}\p{N} ._-]*\.xsig$/iu.test(delivery.filename) ||
    delivery.filename.length > 255
  ) {
    throw new Error('FACe needs an .xsig filename without a path')
  }
  if (
    !/^[\w!#$%&'*+/=?^`{|}~.-]+@[\da-z-]+(?:\.[\da-z-]+)+$/iu.test(
      delivery.email,
    ) ||
    delivery.email.length > 254
  ) {
    throw new Error('FACe needs one email address')
  }
}
