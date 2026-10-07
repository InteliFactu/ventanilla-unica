import type { Successor } from '../types/Successor'

/** Why one `--sucesores` entry cannot be typed into the 036 as given. */
export const successorProblems = (
  successor: Successor,
  index: number,
): readonly string[] => {
  const where = `--sucesores entry ${String(index + 1)}`
  const checks: readonly (readonly [boolean, string])[] = [
    [
      /^[0-9A-Z]{9}$/.test(successor.nif),
      `${where}: NIF must be 9 characters.`,
    ],
    [successor.nombre !== '', `${where}: the name is required.`],
    [
      /^\d{1,3}(?:,\d{1,2})?$/.test(successor.porcentaje),
      `${where}: the percentage must look like 50 or 33,33.`,
    ],
    [
      /^\d+(?:,\d{2})?$/.test(successor.cuota),
      `${where}: the cuota must look like 0,00 or 1234,56.`,
    ],
  ]
  return checks.filter(([ok]) => !ok).map(([, message]) => message)
}
