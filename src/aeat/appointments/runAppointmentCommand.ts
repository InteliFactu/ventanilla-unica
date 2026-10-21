import type { CliOptions } from '../../cli/types/CliOptions'
import type { HttpClient } from '../../http/types/HttpClient'
import { isConfirmed } from '../../write/isConfirmed'
import { bookAppointment } from './bookAppointment'
import { listAppointments } from './listAppointments'
import { appointmentBookingFromOptions } from './mappers/appointmentBookingFromOptions'
import { parseAppointmentQuery } from './parsers/parseAppointmentQuery'
import { writeAppointmentReceipt } from './writeAppointmentReceipt'

/** List offers or prepare an exact slot; a confirmed booking also requires an output directory. */
export const runAppointmentCommand = async (
  client: HttpClient,
  options: CliOptions,
): Promise<unknown> => {
  const query = parseAppointmentQuery(options)
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
  const confirm = isConfirmed(options)
  const directory = options['out']
  if (confirm && !directory)
    throw new Error('--out is required to preserve a booking response')
  const result = await bookAppointment(
    client,
    query,
    appointmentBookingFromOptions(slot, options),
  )
  const receiptPath =
    result.html && directory
      ? await writeAppointmentReceipt(directory, result.html)
      : undefined
  return {
    executed: result.executed,
    confirmed: false,
    slot,
    receiptPath,
    note: result.executed
      ? 'Inspect the saved receipt before retrying any reservation.'
      : 'Plan only; no final reservation was submitted.',
  }
}
