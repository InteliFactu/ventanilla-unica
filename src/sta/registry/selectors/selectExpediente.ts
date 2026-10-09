import type { RegistryExpediente } from '../types/RegistryExpediente'

/** The open expediente numbered `number` (AÑO/NUMERO); an unknown number names the ones that are open. */
export const selectExpediente = (
  expedientes: readonly RegistryExpediente[],
  number: string,
): RegistryExpediente => {
  const found = expedientes.find((expediente) => expediente.numExp === number)
  if (found) return found
  const open = expedientes.map((expediente) => expediente.numExp).join(', ')
  throw new Error(
    `no open expediente ${number} for this party (open: ${open || 'none'})`,
  )
}
