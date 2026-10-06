import type { FilingParty } from '../types/FilingParty'

/** One plan line for a party, or none when the registry printed no such party. */
export const partyLine = (
  role: string,
  value: FilingParty | undefined,
): string[] => (value ? [`${role}: ${value.nif} ${value.nombre}`] : [])
