import type { CliOptions } from '../../cli/types/CliOptions'
import type { HttpClient } from '../../http/types/HttpClient'
import { isConfirmed } from '../../write/isConfirmed'
import { bookAppointment } from './bookAppointment'
import { listAppointments } from './listAppointments'
import { appointmentBookingFromOptions } from './mappers/appointmentBookingFromOptions'
import { parseAppointmentQuery } from './parsers/parseAppointmentQuery'
import { validateAppointmentBookingOptions } from './validators/validateAppointmentBookingOptions'
import { writeAppointmentReceipt } from './writeAppointmentReceipt'

/**
 * List offers or check an exact slot; a confirmed booking also requires an
 * output directory and contact details, both checked before any portal request.
 */
export const runAppointmentCommand = async (
  client: HttpClient,
  options: CliOptions,
): Promise<unknown> => {
  const query = parseAppointmentQuery(options)
  const confirm = Boolean(options['centro']) && isConfirmed(options)
  if (confirm) validateAppointmentBookingOptions(options)
  const slots = await listAppointments(client, query)
  if (!options['centro']) return { executed: false, slots }
  const slot = slots.find(
    (candidate) =>
      candidate.centre === options['centro'] &&
      candidate.date === query.date.replaceAll('-', '') &&
      candidate.start === query.time.replace(':', '') &&
      candidate.kind === 'P',
  )
  if (!slot)
    throw new Error('The requested centre, date and time were not offered')
  if (!confirm)
    return {
      executed: false,
      confirmed: false,
      slot,
      note: 'Plan only; the slot was not preselected or reserved.',
    }
  const result = await bookAppointment(
    client,
    query,
    appointmentBookingFromOptions(slot, options),
  )
  const receiptPath =
    result.html && options['out']
      ? await writeAppointmentReceipt(options['out'], result.html)
      : undefined
  return {
    executed: result.executed,
    confirmed: false,
    slot,
    receiptPath,
    note: 'Inspect the saved receipt before retrying any reservation.',
  }
}
