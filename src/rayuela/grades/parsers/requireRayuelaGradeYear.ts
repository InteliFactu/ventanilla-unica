import type { RayuelaOption } from '../types/RayuelaOption'

/** Verify the portal applied the year selector before interpreting the grades. */
export const requireRayuelaGradeYear = (
  years: readonly RayuelaOption[],
  expectedYear?: string,
): RayuelaOption => {
  if (years.length === 0)
    throw new Error('Rayuela grades academic year selector was not found')
  const selected = years.find((year) => year.selected)
  if (!selected?.label)
    throw new Error('Rayuela did not return a selected academic year')
  if (expectedYear !== undefined && selected.value !== expectedYear)
    throw new Error('Rayuela did not return the requested academic year')
  return selected
}
