import type { StaRegistryReceipt } from '../types/StaRegistryReceipt'

/**
 * Read the submission answer: `{id, date, document: {cud}}` once registered.
 * A `sign` save answers the same shape with nulls, so a missing `id` means
 * nothing was registered and is an error, never a receipt.
 */
export const mapRegistryAnswer = (
  reference: string,
  answer: Readonly<Record<string, unknown>>,
): StaRegistryReceipt => {
  const document = answer['document'] as { readonly cud?: unknown } | null
  const registryNumber = answer['id']
  const registeredAt = answer['date']
  const csv = document?.cud
  if (
    typeof registryNumber !== 'string' ||
    typeof registeredAt !== 'string' ||
    typeof csv !== 'string'
  )
    throw new Error(
      `the registry did not register the request: ${JSON.stringify(answer).slice(0, 300)}`,
    )
  return { reference, registryNumber, registeredAt, csv }
}
