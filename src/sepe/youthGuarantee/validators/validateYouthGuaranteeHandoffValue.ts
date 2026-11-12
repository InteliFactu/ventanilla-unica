/** Never include the value in an error: it is a live code or link. */
export const validateYouthGuaranteeHandoffValue = (
  value: string,
  kind: 'pin' | 'link',
): string => {
  if (kind === 'pin' && !/^[a-z\d]+$/i.test(value))
    throw new Error(
      'Garantía Juvenil: PIN file must contain only letters and digits',
    )
  return value
}
