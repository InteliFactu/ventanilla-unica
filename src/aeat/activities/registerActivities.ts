import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { openAeatSession } from '../session/openAeatSession'
import { openM036Form } from '../taxAddress/openM036Form'
import { pressM036Validation } from '../taxAddress/pressM036Validation'
import { submitM036 } from '../taxAddress/submitM036'
import type { TaxAddressReceipt } from '../taxAddress/types/TaxAddressReceipt'
import { fillActivities } from './fillActivities'
import { planActivities } from './planActivities'
import type { ActivitiesRequest } from './types/ActivitiesRequest'
import { activitiesProblems } from './validators/activitiesProblems'

/**
 * `aeat actividades`: plan a modelo 036 alta of economic activities offline;
 * with `validate` fill it and press "Validar declaración" at the AEAT, filing
 * nothing; only with `confirm` sign and file it.
 */
export const registerActivities = async (
  client: HttpClient,
  request: ActivitiesRequest,
): Promise<WriteResult<TaxAddressReceipt>> => {
  const action = `file AEAT modelo 036: alta of ${String(request.actividades.length)} activities of ${request.nif} from ${request.fecha}`
  const plan = planActivities(request)
  const problems = activitiesProblems(request)
  const live = request.validate || request.confirm
  if (!live || problems.length > 0)
    return { action, executed: false, plan, notes: problems }
  await openAeatSession(client)
  const session = await openM036Form(client, request.nif)
  await fillActivities(session, request)
  await pressM036Validation(session)
  if (!request.confirm)
    return {
      action,
      executed: false,
      plan,
      notes: ['validated at the AEAT without errors; nothing was filed'],
    }
  const receipt = await submitM036(session)
  return { action, executed: true, plan, receipt, notes: [] }
}
