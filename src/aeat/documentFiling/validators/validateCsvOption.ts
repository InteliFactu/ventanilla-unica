/** `--csv`: the 16-character CSV printed on the notification, upper-cased. */
export const validateCsvOption = (value: string | undefined): string => {
  const csv = value?.toUpperCase() ?? ''
  if (!/^[A-Z0-9]{16}$/.test(csv))
    throw new Error('--csv must be the 16-character CSV of the notification')
  return csv
}
