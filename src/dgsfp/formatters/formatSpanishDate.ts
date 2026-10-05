/** A stored date as the request document prints it (`toLocaleDateString('es-ES', {day, month: 'long', year})`). */
export const formatSpanishDate = (iso: string): string => {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]
  const date = new Date(iso)
  return `${String(date.getUTCDate())} de ${months[date.getUTCMonth()] ?? ''} de ${String(date.getUTCFullYear())}`
}
