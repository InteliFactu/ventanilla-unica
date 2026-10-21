/** The portal excludes the exact lower bound; subtract one minute for an inclusive search. */
export const appointmentSearchTime = (time: string): string => {
  const [hours = '09', minutes = '00'] = time.split(':')
  const previous = Math.max(540, Number(hours) * 60 + Number(minutes) - 1)
  return `${String(Math.floor(previous / 60)).padStart(2, '0')}:${String(previous % 60).padStart(2, '0')}`
}
