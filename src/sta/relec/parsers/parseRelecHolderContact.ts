import type { RelecContact } from '../types/RelecContact'
import { parseContactDefaults } from './parseContactDefaults'

/** Read only loadContactsFrom("interesado") branches, excluding other parties and resetContacts(). */
export const parseRelecHolderContact = (script: string): RelecContact => {
  const branches = [
    ...script.matchAll(
      /else\s+if\s*\(\s*tipo\s*==\s*"interesado"\s*\)([\s\S]*?)(?=\bif\s*\(\s*tipo\s*==\s*"representante"\s*\)|\bfunction\s|$)/g,
    ),
  ].map((match) => match[1] ?? '')
  return parseContactDefaults(branches.join('\n'))
}
