import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { HttpClient } from '../http/types/HttpClient'
import type { WriteResult } from '../write/types/WriteResult'
import { mapComplaintPlan } from './mappers/mapComplaintPlan'
import { prepareComplaint } from './prepareComplaint'
import { saveComplaintReceipt } from './saveComplaintReceipt'
import { submitComplaint } from './submitComplaint'
import type { DgsfpComplaintContext } from './types/DgsfpComplaintContext'
import type { DgsfpComplaintQuery } from './types/DgsfpComplaintQuery'
import type { DgsfpReceipt } from './types/DgsfpReceipt'

/**
 * File a complaint with the DGSFP's Servicio de Reclamaciones (procedure 14,
 * TEL43) in the holder's own name. Without confirmation only reads run and,
 * with `--out`, the unsigned request document is saved for review as
 * `solicitud-borrador.pdf`. With confirmation the files are uploaded, the
 * request document signed and the complaint registered.
 */
export const fileDgsfpComplaint = async (
  client: HttpClient,
  query: DgsfpComplaintQuery,
  context: DgsfpComplaintContext,
): Promise<WriteResult<DgsfpReceipt>> => {
  const prepared = await prepareComplaint(client, query, context.identity)
  const action = 'dgsfp reclamacion'
  const plan = mapComplaintPlan(prepared.session.holder, query, prepared)
  if (!context.confirmed) {
    if (context.outDir !== undefined)
      // outDir is the holder's own --out choice, not attacker input.
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await writeFile(
        join(context.outDir, 'solicitud-borrador.pdf'),
        prepared.document,
      )
    return {
      action,
      executed: false,
      plan,
      notes: ['Only reads ran; --confirmar si files the complaint.'],
    }
  }
  const answer = await submitComplaint(client, prepared, context.identity)
  return {
    action,
    executed: true,
    plan,
    receipt: await saveComplaintReceipt(answer, context.outDir),
    notes: [],
  }
}
