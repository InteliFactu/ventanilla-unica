/**
 * Accept `2025` or `2025-2026` and return the `C_ANNO` value the portal
 * expects: the year the academic year starts in.
 */
export const validateRayuelaAcademicYear = (value: string): string => {
  const match = /^(\d{4})(?:-(\d{4}))?$/.exec(value)
  const start = match?.[1]
  const end = match?.[2]
  if (
    start === undefined ||
    (end !== undefined && Number(end) !== Number(start) + 1)
  )
    throw new Error(
      '--curso must be an academic year such as 2025 or 2025-2026',
    )
  return start
}
