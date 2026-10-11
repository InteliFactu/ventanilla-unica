import type { ContactUpdate } from '../types/ContactUpdate'
import type { ImportassPersonalData } from '../types/ImportassPersonalData'

/** The fields the "Modificar datos de contacto" modal posts, with its submit button's `accion`. */
export const mapContactFormFields = (
  current: ImportassPersonalData,
  update: ContactUpdate,
): Record<string, string> => ({
  telefonoFijo: update.landline ?? current.landline,
  prefijo: current.mobilePrefix || '+34',
  telefonoMovil: update.mobile,
  email: update.email,
  accion: 'ACC_GUARDAR_DATOS_CONTACTO',
})
