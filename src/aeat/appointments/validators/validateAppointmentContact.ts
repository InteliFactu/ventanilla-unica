import type { AppointmentContact } from '../types/AppointmentContact'

/**
 * Refuse unusable contact details before any portal request. The AEAT keeps a
 * slot "Cita pendiente de confirmar" as soon as the `cita` step preselects it,
 * so a run that fails after that step hides the slot without booking it.
 */
export const validateAppointmentContact = (
  contact: AppointmentContact,
): void => {
  if (
    !contact.email.includes('@') ||
    !/^\d{9,15}$/u.test(contact.phone) ||
    contact.detail.length > 250
  )
    throw new Error(
      'Booking requires valid contact details and at most 250 detail characters',
    )
}
