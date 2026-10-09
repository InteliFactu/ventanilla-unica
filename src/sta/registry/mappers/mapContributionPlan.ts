import { formatPersonName } from '../formatters/formatPersonName'
import { formatPersonNif } from '../formatters/formatPersonNif'
import type { ContributionPlanFacts } from '../types/ContributionPlanFacts'
import type { StaContributionQuery } from '../types/StaContributionQuery'

/** What a confirmed `aportar` run would register, line by line, for the holder to read before `--confirmar si`. */
export const mapContributionPlan = (
  host: string,
  query: StaContributionQuery,
  facts: ContributionPlanFacts,
): readonly string[] => {
  const holder = formatPersonName(facts.holder)
  const { represented, expediente } = facts
  return [
    `Contribute documents at ${host} to expediente ${expediente.numExp}${expediente.procedure ? ` (${expediente.procedure})` : ''}`,
    represented === undefined
      ? `As ${holder}, in their own name`
      : `As ${holder}, representing ${formatPersonName(represented)} (${formatPersonNif(represented)})`,
    ...(query.comment === undefined
      ? []
      : [`Additional information: ${query.comment}`]),
    ...facts.files.map(
      (file, index) =>
        `Attach ${String(index + 1)}: ${file.name} (${String(file.bytes)} bytes)${query.descriptions[index] ? `, described as "${query.descriptions[index]}"` : ''}`,
    ),
    `Electronic notifications, notice to ${facts.notificationEmail}`,
  ]
}
