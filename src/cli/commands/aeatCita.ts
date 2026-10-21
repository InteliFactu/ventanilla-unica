import { runAppointmentCommand } from '../../aeat/appointments/runAppointmentCommand'
import type { Command } from '../types/Command'

export const aeatCita: Command = {
  portal: 'aeat',
  action: 'cita',
  description:
    'List in-person AEAT appointments for a holder, service and postal code. --centro selects an exact date/time; --confirmar si reserves it and --out preserves the response. Default service: Aplazamientos. A booking does not apply for a deferral or change any debt.',
  options: [
    'nif',
    'nombre',
    'servicio',
    'postal',
    'fecha',
    'hora',
    'centro',
    'email',
    'telefono',
    'detalle',
  ],
  login: 'password',
  effect: 'write',
  run: runAppointmentCommand,
}
