/** A visibility attribute that suppresses the element and its contents. */
export const isHiddenAgreementAttribute = (
  name: string,
  value: string,
): boolean =>
  name === 'hidden' ||
  name === 'inert' ||
  (name === 'aria-hidden' && /^true$/i.test(value)) ||
  (name === 'style' &&
    /\b(?:display\s*:\s*none|visibility\s*:\s*(?:hidden|collapse))\b/i.test(
      value,
    ))
