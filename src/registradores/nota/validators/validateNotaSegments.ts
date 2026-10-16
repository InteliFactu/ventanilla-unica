import type { NotaSegment } from '../types/NotaSegment'

/** `--segmentos a,b`: the optional sections, `administradores` alone by default (what ROLECE asks for). */
export const validateNotaSegments = (
  value: string | undefined,
): NotaSegment[] => {
  const known: readonly NotaSegment[] = [
    'capital',
    'administradores',
    'actos',
    'libros',
  ]
  const names = (value ?? 'administradores')
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name !== '')
  const segments = known.filter((segment) => names.includes(segment))
  const unknown = names.filter((name) => !known.includes(name as NotaSegment))
  if (unknown.length > 0 || segments.length === 0)
    throw new Error(`--segmentos takes a list of ${known.join(', ')}`)
  return segments
}
