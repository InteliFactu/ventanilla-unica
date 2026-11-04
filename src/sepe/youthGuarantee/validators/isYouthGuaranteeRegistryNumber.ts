/** Reject placeholders; the live receipt format still requires acceptance. */
export const isYouthGuaranteeRegistryNumber = (value: string): boolean =>
  /^[\w/-]{8,64}$/.test(value) && /\d/.test(value) && !/^0+$/.test(value)
