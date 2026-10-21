import { htmlToText } from '../../../html/htmlToText'
import { unescapeHtml } from '../../../html/unescapeHtml'
import type { AppointmentSlot } from '../types/AppointmentSlot'
import { readAppointmentField } from './readAppointmentField'

/** Parse only the slot object emitted by the official selection handler. */
export const parseAppointmentSlot = (source: string): AppointmentSlot => ({
  centre: readAppointmentField(source, 'centro'),
  date: readAppointmentField(source, 'dia'),
  start: readAppointmentField(source, 'horaI'),
  end: readAppointmentField(source, 'horaF'),
  service: readAppointmentField(source, 'servicio'),
  address: htmlToText(unescapeHtml(readAppointmentField(source, 'direccion'))),
  kind: readAppointmentField(source, 'tipoCentro'),
})
