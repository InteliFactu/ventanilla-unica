import type { ContactUpdate } from '../types/ContactUpdate'
import type { ImportassPersonalData } from '../types/ImportassPersonalData'

/** One line per contact field the update would change, `field: before -> after`; empty when nothing differs. */
export const mapContactChanges = (
  current: ImportassPersonalData,
  update: ContactUpdate,
): string[] => {
  const wanted: readonly (readonly [string, string, string | undefined])[] = [
    ['teléfono móvil', current.mobile, update.mobile],
    ['correo electrónico', current.email, update.email],
    ['teléfono fijo', current.landline, update.landline],
  ]
  return wanted
    .filter(([, before, after]) => after !== undefined && after !== before)
    .map(
      ([label, before, after]) =>
        `${label}: ${before || '(none)'} -> ${after ?? ''}`,
    )
}
