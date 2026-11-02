import type { EconomicActivity } from '../types/EconomicActivity'

/** Why one `--actividades` entry cannot be typed into the 036 as given. */
export const activityProblems = (
  activity: EconomicActivity,
  index: number,
): readonly string[] => {
  const where = `--actividades entry ${String(index + 1)}`
  const checks: readonly (readonly [boolean, string])[] = [
    [
      /^[AB]\d{2}$/.test(activity.tipo),
      `${where}: the tipo must look like A03 or A05.`,
    ],
    [
      /^[123]$/.test(activity.seccion),
      `${where}: the sección must be 1, 2 or 3.`,
    ],
    [
      /^\d{3,4}$/.test(activity.epigrafe),
      `${where}: the grupo or epígrafe must be 3 or 4 digits (763, 965.4).`,
    ],
    [activity.descripcion !== '', `${where}: the description is required.`],
  ]
  return checks.filter(([ok]) => !ok).map(([, message]) => message)
}
