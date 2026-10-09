import type { HttpClient } from '../../http/types/HttpClient'
import type { StaPortal } from '../types/StaPortal'
import { buildRegistryParties } from './builders/buildRegistryParties'
import { contributionProcedures } from './contributionProcedures'
import { fetchPartyExpedientes } from './fetchers/fetchPartyExpedientes'
import { readRegistryContext } from './fetchers/readRegistryContext'
import { mapContributionPlan } from './mappers/mapContributionPlan'
import { selectContributionSlot } from './selectors/selectContributionSlot'
import { selectExpediente } from './selectors/selectExpediente'
import { selectNotificationEmail } from './selectors/selectNotificationEmail'
import { selectRepresentedEntity } from './selectors/selectRepresentedEntity'
import type { ContributionPreparation } from './types/ContributionPreparation'
import type { StaContributionQuery } from './types/StaContributionQuery'
import { assertPdfFiles } from './validators/assertPdfFiles'

/**
 * The read-only half of a contribution: the files checked, a fresh draft,
 * the holder, the entity it acts for (by the SPA's own rule), the party's
 * open expedientes and the procedure's contribution slot, plus the plan.
 */
export const prepareStaContribution = async (
  client: HttpClient,
  portal: StaPortal,
  query: StaContributionQuery,
): Promise<ContributionPreparation> => {
  const procedureId = contributionProcedures[portal]
  if (!procedureId) throw new Error(`${portal}: contribution not mapped`)
  const files = await assertPdfFiles(query.documents)
  const { origin, session, person, schema } = await readRegistryContext(
    client,
    portal,
    procedureId,
  )
  const represented = selectRepresentedEntity(person)
  const parties = buildRegistryParties(person, represented)
  const subject = parties['subject'] as Readonly<Record<string, unknown>>
  const expediente = selectExpediente(
    await fetchPartyExpedientes(client, origin, subject),
    query.expediente,
  )
  const notificationEmail = selectNotificationEmail(person)
  const facts = { holder: person, represented, expediente, notificationEmail }
  return {
    origin,
    session,
    person,
    slot: selectContributionSlot(schema),
    content: {
      parties,
      apordoc: { expId: expediente.dboid, aditionalInfo: query.comment },
      notificationEmail,
      descriptions: query.descriptions,
    },
    plan: mapContributionPlan(new URL(origin).hostname, query, {
      ...facts,
      files,
    }),
  }
}
