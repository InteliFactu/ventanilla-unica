import { compliancePurposes } from '../compliancePurposes'
import type { CompliancePurpose } from '../types/CompliancePurpose'

/** Accept `--finalidad` by name; absent means `contratacion`, the purpose the command exists for. */
export const validateCompliancePurpose = (
  input: string | undefined,
): CompliancePurpose => {
  if (input === undefined) return 'contratacion'
  const purposes = Object.keys(
    compliancePurposes,
  ) as readonly CompliancePurpose[]
  const found = purposes.find((purpose) => purpose === input)
  if (found) return found
  throw new Error(
    `--finalidad must be one of ${purposes.join(', ')}; got "${input}"`,
  )
}
