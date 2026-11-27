/** True for a valid 24-hour `H:MM` or `HH:MM` label. */
export const isRayuelaClockTime = (label: string): boolean => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(label)
  return match !== null && Number(match[1]) < 24 && Number(match[2]) < 60
}
