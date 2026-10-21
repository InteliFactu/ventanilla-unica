import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { ScriptedClientExtras } from '../../../http/types/ScriptedClientExtras'
import { appointmentOffers } from './appointmentOffers'
import { appointmentResponse } from './appointmentResponse'

/** One full fresh session, including a final response only if requested. */
export const appointmentClient = (
  offers = appointmentOffers,
  confirmation = 'onSubmitConfirmaCita() femail1 00000000T 23 de octubre de 2026 a las 11:30 Test Street 10000 Test City',
): HttpClient & ScriptedClientExtras =>
  scriptedClient(
    appointmentResponse('identificacion'),
    appointmentResponse("'valueProcedimiento':'C324163'"),
    appointmentResponse('cita'),
    appointmentResponse(offers),
    appointmentResponse(confirmation),
    appointmentResponse('Cita confirmada'),
  )
