/** `--telefono`: the contact phone the form requires, spaces removed. */
export const validatePhoneOption = (value: string | undefined): string => {
  const phone = value?.replaceAll(' ', '') ?? ''
  if (!/^\+?\d{9,15}$/.test(phone))
    throw new Error('--telefono must be a phone number')
  return phone
}
