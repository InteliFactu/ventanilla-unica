import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { ScriptedClientExtras } from '../../../http/types/ScriptedClientExtras'
import { appointmentErrorPage } from './appointmentErrorPage'
import { appointmentOffers } from './appointmentOffers'
import { appointmentResponse } from './appointmentResponse'

/** A search session whose `procedimiento` or `cita` step answers the error page. */
export const refusingAppointmentClient = (
  step: 'procedimiento' | 'cita',
  status = 299,
): HttpClient & ScriptedClientExtras =>
  scriptedClient(
    appointmentResponse('identificacion'),
    appointmentResponse("'valueProcedimiento':'C324163'"),
    step === 'procedimiento'
      ? appointmentResponse(appointmentErrorPage, status)
      : appointmentResponse('procedimiento'),
    step === 'cita'
      ? appointmentResponse(appointmentErrorPage, status)
      : appointmentResponse(appointmentOffers),
  )
