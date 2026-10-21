/** Spanish date spelling used in the appointment confirmation screen. */
export const formatAppointmentDate = (compactDate: string): string =>
  new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(
    new Date(
      `${compactDate.slice(0, 4)}-${compactDate.slice(4, 6)}-${compactDate.slice(6, 8)}T12:00:00Z`,
    ),
  )
