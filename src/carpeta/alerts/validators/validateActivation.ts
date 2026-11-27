import type { AlertSettings } from '../types/AlertSettings'

/**
 * Refuse what the Carpeta front refuses before it shows the calendar form:
 * no verified alert email (`prefEmailVerif`), or an alert email edited since
 * it was verified; and refuse a group level the Carpeta does not list.
 */
export const validateActivation = (
  settings: AlertSettings,
  levels: readonly number[],
): void => {
  if (!settings.verifiedEmail || settings.verifiedEmail !== settings.email)
    throw new Error(
      'Carpeta: the alert email is not verified; run `carpeta email` and `carpeta confirmar-email` first',
    )
  const known = settings.groups.map((group) => group.level)
  if (new Set(known).size !== known.length)
    throw new Error(
      'Carpeta: the alert settings contain duplicate group levels',
    )
  const unknown = levels.filter((level) => !known.includes(level))
  if (unknown.length > 0)
    throw new Error(
      `Carpeta: no alert group has level ${unknown.join(', ')}; \`carpeta avisos\` lists them (${known.join(', ')})`,
    )
}
